export const _base_ = 'http://oskg.whu.edu.cn/Web_NEview'

export const _api_ = {
  // get with model_id
  exportRadar: '/result/ExportRadarPath',
  exportCoword: '/result/ExportCoword',
  exportKey: '/result/ExportKey',
  // get with model_id,cluster_id,label
  exportCluster: '/result/ExportClusterInfo',
  // post
  getEvoFile: '/result/getEvoFile',
  getZpFile: '/result/getZpFile',
  getRadarPath:'/result/getRadarPath',
  getCoword:'/result/getCoword',
  getGraphInfo:'/result/getGraphInfo',
  getPickedClusterInfo:'/result/getPickedClusterInfo',
  // post
  datasetUpload:'/dataset/upload'
}

export namespace _params_ {
}