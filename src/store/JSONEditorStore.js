import { observable, computed, action, toJS } from 'mobx';
import { message } from 'antd';
import { getJSONDataByKeyRoute, getParentKeyRoute_CurKey } from '$utils/jsonData';
import { objClone } from '$utils/index';

/**
 * 用于管控JSON数据内容的全局store
 * */

export default class JSONEditorStore {
  /** 主要用于自动生成jsonKey中的index */
  curJsonKeyIndex = 1; // 非响应式
  /**
   * triggerChange: 用于强制触发更新事件
   */
  @observable triggerChange = false;
  /**
   * jsonSchema: JSONSchema数据对象
   */
  @observable jsonData = {};

  /**
   * triggerChangeAction: 用于主动触发更新事件
   */
  @action.bound
  triggerChangeAction() {
    this.triggerChange = !this.triggerChange;
  }

  /** 初始化jsonData  */
  @action.bound
  initJSONData(jsonData, jsonSchema) {
    if (!jsonData || JSON.stringify(jsonData) === '{}') {
      // 根据jsonSchema生成一份对应的jsonData
      /** 待开发 */
      this.jsonData = {};
    } else {
      this.jsonData = jsonData;
    }
    this.curJsonKeyIndex = 1; // 每次初始化，都需要重置curJsonKeyIndex值
  }

  @computed get JSONSchemaObj() {
    return toJS(this.jsonData);
  }

  /** 根据key索引路径获取对应的json数据[非联动式数据获取]  */
  @action.bound
  getJSONDataByKeyRoute(keyRoute) {
    return getJSONDataByKeyRoute(keyRoute, this.jsonData, true); // useObjClone: true 避免后续产生数据联动
  }

  /** 根据key路径更新对应的json数据
   * 备注：从jsonData中获取数据，需要先获取父级对象（以便产生数据联动），
   * 再根据最近的key值对当前数据进行编辑
   * */
  @action.bound
  updateFormValueData(keyRoute, newVal) {
    // 1. 获取父级key路径和最近的有一个key
    const parentKeyRoute_CurKey = getParentKeyRoute_CurKey(keyRoute);
    const parentKeyRoute = parentKeyRoute_CurKey[0];
    const curKey = parentKeyRoute_CurKey[1];
    // 2. 获取父级数据对象
    const parentJsonDataObj = getJSONDataByKeyRoute(parentKeyRoute, this.jsonData);
    // 3. 数值更新
    parentJsonDataObj[curKey] = newVal;
    console.log(this.JSONSchemaObj);
  }
}
