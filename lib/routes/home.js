module.exports = {
    method: 'GET',
    path: '/',
    config: {
      handler:(request, reply) => {
        if (!request.state.access_token) {
          reply.redirect('/login');
        } else {
          reply.view('logged-in');
        }
      }
    }
};




//
//
// module.exports = {
//   path: '/',
//   method: 'GET',
//   handler: (request, reply) => {
//     reply.view('home');
//   }
// };
