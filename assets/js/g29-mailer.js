/*
  Emails an enquiry to info@g29consults.com via Web3Forms (the site has no
  backend). The access key is public by design: it can only deliver to the
  inbox it was issued for. Fire-and-forget — WhatsApp remains the main
  hand-off, so a failed email never blocks the visitor.
*/
(function () {
  var ACCESS_KEY = '40eefe3c-8291-457c-bc65-2f3b9d76fa70';
  window.G29Mail = {
    send: function (subject, fields) {
      try {
        var body = { access_key: ACCESS_KEY, subject: subject, from_name: 'G29 Website' };
        Object.keys(fields).forEach(function (k) { if (fields[k]) body[k] = fields[k]; });
        return fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(body),
          keepalive: true
        }).catch(function () {});
      } catch (e) { return null; }
    }
  };
})();
