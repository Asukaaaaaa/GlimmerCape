export const _base_ = 'http://oskg.whu.edu.cn/Web_NEview';

export const _api_ = {
  // post sign
  userLogin: '/user/login',
  userRegister: '/user/signUp',
  getUserInfo: '/user/getUserInfo',
  adminLogin: '/admin/login',
  // post project list
  getProjectList: '/project/getProjectList',
  // post project detail
  getDatasetList: '/dataset/getDatasetList',
  uploadDataset: '/dataset/upload',
  deleteDataset: '/dataset/deleteDataset',
  getModelList: '/model/getModelList',
  createModel: '/model/createModel',
  deleteModel: '/model/deleteModel',
  
  // // post
  // getEvoFile: '/result/getEvoFile',
  // getZpFile: '/result/getZpFile',
  // getRadarPath: '/result/getRadarPath',
  // getCoword: '/result/getCoword',
  // getGraphInfo: '/result/getGraphInfo',
  // getPickedClusterInfo: '/result/getPickedClusterInfo',
  // // get with model_id
  // exportRadar: '/result/ExportRadarPath',
  // exportCoword: '/result/ExportCoword',
  // exportKey: '/result/ExportKey',
  // // get with model_id,cluster_id,label
  // exportCluster: '/result/ExportClusterInfo',
};

export namespace _params_ {}
