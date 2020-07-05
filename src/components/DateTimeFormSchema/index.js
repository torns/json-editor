import * as React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { DatePicker, message, Tooltip } from 'antd';
import { getCurrentFormat } from '$utils/jsonSchema';

const DateTypeList = {
  'date-time': 'YYYY-MM-DD HH:mm',
  'date': 'YYYY-MM-DD',
  'time': 'HH:mm',
};

class DateTimeFormSchema extends React.PureComponent {
  static propTypes = {
    parentType: PropTypes.string,
    jsonKey: PropTypes.string,
    indexRoute: PropTypes.string,
    keyRoute: PropTypes.string,
    nodeKey: PropTypes.string,
    targetJsonData: PropTypes.any,
  };

  constructor(props) {
    super(props);
    // 这边绑定是必要的，这样 `this` 才能在回调函数中使用
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  /** 数值变动事件处理器 */
  handleValueChange = (time, timeString) => {
    console.log(timeString);
    const {
      indexRoute,
      jsonKey,
      updateFormValueData,
      targetJsonData,
    } = this.props;
    /*if (targetJsonData.title === value) return; // title值未改变则直接跳出
    updateFormValueData(indexRoute, jsonKey, {
      title: value,
    });*/
  };

  render() {
    const {
      indexRoute,
      nodeKey,
      keyRoute,
      targetJsonData,
      pageScreen,
    } = this.props;
    const curFormat = getCurrentFormat(targetJsonData);
    const timeFormat = DateTypeList[curFormat] || DateTypeList[0];

    return (
      <div
        className={
          pageScreen === 'wideScreen'
            ? 'wide-screen-element-warp'
            : 'mobile-screen-element-warp'
        }
        key={nodeKey}
      >
        <Tooltip
          title={targetJsonData.description}
          placement={pageScreen === 'wideScreen' ? 'topRight' : 'topLeft'}
        >
          <div className="element-title">{targetJsonData.title}</div>
        </Tooltip>
        <div className="content-item">
          <DatePicker
            style={{ display: 'inline-block' }}
            showTime
            format={timeFormat}
            placeholder={
              targetJsonData.placeholder || `请输入${targetJsonData.title}`
            }
            defaultValue={targetJsonData.default}
            onChange={this.handleValueChange}
          />
        </div>
      </div>
    );
  }
}

export default inject((stores) => ({
  pageScreen: stores.JSONSchemaStore.pageScreen,
  getJSONDataByIndex: stores.JSONSchemaStore.getJSONDataByIndex,
  editJsonData: stores.JSONEditorStore.updateFormValueData,
}))(observer(DateTimeFormSchema));
