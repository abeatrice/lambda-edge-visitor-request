/**
 *
 * @param {number} len // Should be called with 16 to create 16 character string.
 * @description A function to create a 16^16 hex character string for unique id. This is a fallback function that
 *              should NEVER get called.
 *
 */
 const getRandomHexId = len => {
    let result = '';
    const chars = 'abcdef0123456789';
    const charLen = chars.length;
    for (let i = 0; i < len; i += 1) {
      result += chars.charAt(Math.floor(Math.random() * charLen));
    }
    return `visitor_id=${result};`;
  };
  
  /**
   *
   * @param {object} headers
   * @description A function that takes the headers from the event object and looks for an existing "visitor_id".
   *              If it exists it passes it back as a "set-cookie" value. If it doesn't exist it creates it from
   *              the "x-amz-cf-id" AWS cloudfront id that exists already. If neither exists (should never happen)
   *              we get a 16^16 hex character string as an ID. If we see this in the logs we know there is an error.
   */
  const getCookieInfo = (headers, requestId) => {
    let cookieArray;
    let existingCookie = '';
  
    if (headers.cookie && headers.cookie.length > 0) {
      cookieArray = headers.cookie[0].value.split(';');
      cookieArray.forEach(ar => {
        if (ar.includes('visitor_id')) {
          existingCookie = `${ar};`;
        }
      });
  
      if (existingCookie !== '') {
        return existingCookie;
      }
    }
  
    if (requestId) {
      return `visitor_id=${requestId};`;
    }
    return getRandomHexId(16);
  };
  
  /**
   *
   * @param {*} event 'Automagically provided by AWS'
   * @param {*} context 'Automagically provided by AWS'
   * @param {*} callback 'Automagically provided by AWS'
   * @description The default function called by AWS Lambda This function should never be called by anyone but AWS Lambda.
   */
  exports.handler = (event, context, callback) => {
    const { headers } = event.Records[0].cf.request;
    const resHeaders = event.Records[0].cf.response.headers;
    const requestId = context.awsRequestId;
  
    if (!resHeaders['set-cookie']) {
      resHeaders['set-cookie'] = [];
    }
  
    const maxAge = 365 * 24 * 60 * 60;
    const date = new Date();
    date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
  
    resHeaders['set-cookie'].push({
      key: 'Set-Cookie',
      value: `${getCookieInfo(headers, requestId)}expires=${date.toGMTString()};max-age=${maxAge}`
    });
  
    callback(null, event.Records[0].cf.response);
  };
  