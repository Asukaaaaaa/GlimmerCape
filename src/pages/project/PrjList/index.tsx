import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, List, Typography } from 'antd';
import React, { Component } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import { connect, CurrentUser, Dispatch, UserModelState, Link } from 'umi';
import { StateType } from './model';
import { CardListItemDataType } from './data.d';
import styles from './style.less';
import logo from '@/assets/logo.svg';

const { Paragraph } = Typography;

interface ProjectProps {
  currentUser: CurrentUser;
  projectAnd: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}
interface ProjectState {
  visible?: boolean;
  done?: boolean;
  current?: Partial<CardListItemDataType>;
  fetchCounts?: number;
}

class Project extends Component<ProjectProps, ProjectState> {
  state: ProjectState = { fetchCounts: 1 };

  componentDidMount() {
    const { dispatch, currentUser } = this.props;

    dispatch({
      type: 'projectAnd/fetch',
      payload: {
        user_id: currentUser.userid,
        page_num: this.state.fetchCounts,
        // page_size: 20
      },
    });
  }

  render() {
    const {
      projectAnd: { list },
      loading,
    } = this.props;

    const content = (
      <div className={styles.pageHeaderContent}>
        <p></p>
        <div className={styles.contentLink}>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />{' '}
            快速开始
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg" />{' '}
            产品简介
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg" />{' '}
            产品文档
          </a>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="这是一个标题"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        />
      </div>
    );
    const nullData: Partial<CardListItemDataType> = {};
    return (
      <PageContainer content={content} extraContent={extraContent}>
        <div className={styles.cardList}>
          <List<Partial<CardListItemDataType>>
            rowKey="id"
            loading={loading}
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 4,
              xxl: 4,
            }}
            dataSource={[nullData, ...list]}
            renderItem={(item) =>
              item?.projectId ? (
                <List.Item key={item.projectId}>
                  <Card
                    hoverable
                    className={styles.card}
                    actions={[
                      <Link to={`/project/detail/dataset/${item.projectId}`} key="option1">
                        数据集
                      </Link>,
                      <Link to={`/project/detail/model/${item.projectId}`} key="option2">
                        模型
                      </Link>,
                    ]}
                  >
                    <Card.Meta
                      avatar={
                        <img alt="" className={styles.cardAvatar} src={item.avatar || logo} />
                      }
                      title={<a>{item.projectName}</a>}
                      description={
                        <Paragraph className={styles.item} ellipsis={{ rows: 3 }}>
                          {item.projectDesc}
                        </Paragraph>
                      }
                    />
                  </Card>
                </List.Item>
              ) : (
                <List.Item>
                  <Button type="dashed" className={styles.newButton}>
                    <PlusOutlined /> 新增产品
                  </Button>
                </List.Item>
              )
            }
          />
        </div>
      </PageContainer>
    );
  }
}

export default connect(
  ({
    user,
    projectAnd,
    loading,
  }: {
    user: UserModelState;
    projectAnd: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    currentUser: user.currentUser,
    projectAnd,
    loading: loading.models.projectAnd,
  }),
)(Project);
