import type { CascaderOption } from 'antdv-next-mobile'

export const regions: CascaderOption[] = [
  {
    label: '浙江省',
    value: 'zhejiang',
    children: [
      {
        label: '杭州市',
        value: 'hangzhou',
        children: [
          { label: '西湖区', value: 'xihu' },
          { label: '余杭区', value: 'yuhang' },
          { label: '滨江区', value: 'binjiang' },
          { label: '萧山区', value: 'xiaoshan' },
        ],
      },
      {
        label: '宁波市',
        value: 'ningbo',
        children: [
          { label: '海曙区', value: 'haishu' },
          { label: '鄞州区', value: 'yinzhou' },
        ],
      },
      { label: '舟山市（暂未开通）', value: 'zhoushan', disabled: true },
    ],
  },
  {
    label: '江苏省',
    value: 'jiangsu',
    children: [
      {
        label: '南京市',
        value: 'nanjing',
        children: [
          { label: '玄武区', value: 'xuanwu' },
          { label: '鼓楼区', value: 'gulou' },
          { label: '建邺区', value: 'jianye' },
        ],
      },
      {
        label: '苏州市',
        value: 'suzhou',
        children: [
          { label: '姑苏区', value: 'gusu' },
          { label: '吴中区', value: 'wuzhong' },
        ],
      },
    ],
  },
  {
    label: '上海市',
    value: 'shanghai',
    children: [
      { label: '黄浦区', value: 'huangpu' },
      { label: '徐汇区', value: 'xuhui' },
      { label: '浦东新区', value: 'pudong' },
    ],
  },
]
