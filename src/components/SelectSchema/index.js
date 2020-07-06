import * as React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Checkbox, message, Radio, Tooltip } from 'antd';

class SelectSchema extends React.PureComponent {
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
  handleValueChange = (event) => {
    const { value } = event.target;
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
    // 获取枚举值
    const enumKeys = targetJsonData.items.enum;
    const enumTexts = targetJsonData.items.enumextra;

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
          <Checkbox.Group
            style={{ display: 'inline-block' }}
            onChange={this.handleValueChange}
            defaultValue={targetJsonData.default}
          >
            {enumKeys &&
            enumKeys.length > 0 &&
            enumKeys.map((enumKey, enumIndex) => {
              /** 1. 获取当前enum的title */
              const enumText = enumTexts[enumIndex];
              /** 2. 获取当前元素的id，用于做唯一标识 */
              const enumNodeKey = `${nodeKey}-radio-${enumKey}`;
              return (
                <Checkbox value={enumKey} key={enumNodeKey}>{enumText}</Checkbox>
              );
            })}
          </Checkbox.Group>
        </div>
      </div>
    );
  }
}

export default inject((stores) => ({
  pageScreen: stores.JSONSchemaStore.pageScreen,
  getJSONDataByIndex: stores.JSONSchemaStore.getJSONDataByIndex,
  editJsonData: stores.JSONEditorStore.updateFormValueData,
}))(observer(SelectSchema));
