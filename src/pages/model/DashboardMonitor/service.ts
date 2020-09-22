import request from 'umi-request';

export async function queryTags() {
  return request('/api/tags');
}

export async function queryRadarData() {
  return request('/api/radar_chart_data');
}
