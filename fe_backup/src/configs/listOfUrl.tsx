const APIHOST = 'localhost' ;
const APIPORT = '8080';
const link_api = 'http://'+APIHOST+':'+APIPORT

const listOfUrl = {
  base: link_api,
  login: link_api+'/api/auth/signin',
  changePassphrase: link_api+'/api/auth/changepassphrase',
  checkPassphrase: link_api+'/api/auth/checkpassphrase',
  createMessage: link_api+'/api/message/create',
  uploadAttachment: link_api+'/api/message/attachment/new',
  deleteMessage: link_api+'/api/message/delete',
  getDraftMessage: link_api+'/api/message/draft/get',
  getSentMessage: link_api+'/api/message/sent/get',
  getPublicKey: link_api+'/api/message/getpublic',
  getPrivateKey: link_api+'/api/message/getprivate',
};

export default listOfUrl;