// packageA/pages/selectCity/selectCity.js
const 
  cityAll
= require('../../utils/city')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: "", // 当前定位城市

    locationVO: {}, // 当前所选择的城市位置
    provinceLocation: {}, // 记录选择省的位置
    allCityList: [],
    provinceList: [], // 省
    regionList: [], // 区

    selectCityList: [], // 当前选择市列表

    cityList: [], // 列表中显示的市
    /** 选择后的省市区名称 */
    provinceName: "",
    cityName: "",
    regionName: ""
  },
  getAreaTree() {
      // 默认获取 所有的省
      cityAll.cityData.forEach(it => {
        this.data.provinceList.push({
          children: it.children,
          id: it.id,
          locationVO: it.locationVO,
          name: it.name,
          level: 1
        })
      })
      this.setData({
        cityList: this.data.provinceList,
        allCityList:  cityAll.cityData
      })
  },
  // 切换省市区  1省2市3区
  changeCity(e) {
    const level = e.currentTarget.dataset.level
    if (level == 1) {
      // 显示所有省
      this.data.cityList = this.data.provinceList,
        this.setData({
          cityList: this.data.cityList,
          regionName: "",
          cityName: "",
          locationVO: this.data.provinceLocation
        })
    } else if (level == 2) {
      console.log('点击市');
      if (!this.data.provinceName) {
        wx.showToast({
          title: '请选择省',
          icon: "none"
        })

        return false
      }
      this.setData({
        cityList: this.data.selectCityList,
        /**点击市后清空市,区 并将当前的省赋值位置 */
        regionName: "",
        cityName: "",
        locationVO: this.data.provinceLocation
      })
    }
  },

  // 选择市
  citySelect(e) {
    console.log('e', e);
    const item = e.currentTarget.dataset.item
    // console.log('level',item?.level);
    
    if (item.level && item.level == 1) {
      console.log('item', item.children);
      this.setData({
        provinceName: item.name,
        cityList: item.children,
        selectCityList: item.children,
        provinceLocation: item.locationVO,
        locationVO: item.locationVO
      })
    } else {
      // 没有children就是区
      if (!item.children.length) {
        console.log('点的区');
        this.setData({
          regionName: item.name,
          locationVO: item.locationVO
        })
      } else {
        this.setData({
          cityName: item.name,
          cityList: item.children,
          locationVO: item.locationVO
        })
      }
    }
  },

  // 确认并返回
  confirm(e) {
    console.log('e', e);
    if (e.currentTarget.dataset.state == 'now') {
      const locationVO = {
        lat: wx.getStorageSync('nowLatitude'),
        lng: wx.getStorageSync('nowLongitude')
      }
      wx.navigateBack({
        delta: 1,
      })
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      prevPage.setData({
        from: 'selectCity',
        locationVO: locationVO,
        activeCity: wx.getStorageSync('city'),
        scale: 9
      })
    } else if(e.currentTarget.dataset.state == 'nationwide'){
      wx.navigateBack({
        delta: 1,
      })
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      prevPage.setData({
        from: 'selectCity',
        locationVO: {lat:28.988728,lng:102.092121},
        activeCity:"全国",
        scale:3,
      })
    } else {
      if (!this.data.provinceName) {
        wx.showToast({
          title: '请选择',
          icon: "none"
        })
        return false
      }
      wx.navigateBack({
        delta: 1,
      })
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      prevPage.setData({
        from: 'selectCity',
        locationVO: this.data.locationVO,
        activeCity: this.data.regionName || this.data.cityName || this.data.provinceName,
        scale: this.scale()

      })
      
    }

  },
  scale() {
    if (this.data.provinceName && !this.data.cityName && !this.data.regionName) {
      console.log('1');
      return 5;
    } else if (this.data.cityName && !this.data.regionName) {
      console.log('2');
      return 7;
    } else if (this.data.regionName) {
      console.log('3');
      return 8;
    } 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getAreaTree()

  },
  onSelect(e) {
    const {
      index
    } = e.detail;

    console.log(index);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

    // setTimeout(() => {
    //   let query = wx.createSelectorQuery();
    //   query.select('.city_select').boundingClientRect(rect => {
    //     let height = rect.height
    //     console.log('获取的高度', height);
    //     this.setData({
    //       selectHeight: height
    //     })
    //   }).exec();
    // }, 300)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})