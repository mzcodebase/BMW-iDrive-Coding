var router = new VueRouter({ mode: "history", routes: [] });
var host = "";
var appCoding = new Vue({
  router,
  el: "#app",
  data() {
    return {
      termsConditions: false,
      totalCartPrice: 0,
      vin: "",
      fullVin: "",
      vinSet: false,
      vinSeries: "",
      agreement: false,
      loading: false,
      showFilters: true,
      productLoading: false,
      productLoadingId: "",
      productList: [],
      productsToShow: 15,
      productsToShowBar: 0,
      selectedProducts: [],
      vinProducts: [],
      cartProducts: [],
      showDetails: "",
      cartId: 0,
      searchProductId: "",
      searchProductVinId: "",
      filters: {
        sound: false,
        infotainment: false,
        doors_trunk: false,
        navigation: false,
        display: false,
        service_diagnostic: false,
        video: false,
        control: false,
      },
      sort: "Default",
      filterType: "all",
      sortMessage: "Default",
      carHeadUnit: "",
      installationStep: "usb",
      includeCable: false,
      includeEthAdapter: {
        added: false,
        stock: false,
        price: 31.49,
        // price: 34.99,
        orignalPrice: 34.99,
        type: "",
      },
      showCable: false,
      showCableCheckbox: false,
      cableCheckbox: false,
      addedWifi: false,
      addedWifiProductId: 0,
      acceptTerms: false,
      minimumAmount: 70,
      cartTotal: 0,
      debugMode: false,
      userReviews: [],
      userReviewSelected: 0,
      userReviewAvg: 0,
      showReviews: 0,
      posts: [],
      postsToShow: 6,
      postsToShowBar: 0,
      videoUrl: "",
      currentYear: moment().format("YYYY"),
      topSeller: 0,
      wifiAntennaCompatible: false,
      // banner: './assets/img/banner/banner.jpeg',
      banner: "./assets/img/banner/idriveCodingBanner.jpg",
      promoBanner: "",
      isSaleActive: false,
      preUrl: "",
      isMobile: false,
      fb23preHeader: "",
    };
  },
  mounted() {
    var that = this;
    this.loadStartUp();
    this.isMobile = this.isMobileDevice();
    if (that.$route.query.mode == "live") {
      that.preUrl = "https://www.bimmer-tech.net";
    }
    this.productsToShowBar =
      (this.productsToShow * 100) / this.productList.length;
    if (this.$route.query.product) {
      this.searchProductId = this.$route.query.product;
    }
    if (this.$route.query.vin) {
      this.vin = this.$route.query.vin;
      this.checkVin("no scroll");
    } else {
      this.loadStartUp();
    }
    if (this.$route.query.category) {
      that.multipleFilters(this.$route.query.category);
    }
    if (this.$route.query.type) {
      that.productFilterType(this.$route.query.type);
    }

    if (this.$route.query.cart) {
      this.cartId = this.$route.query.cart;
    }
    if (this.debugMode) {
      host = "https://newshop.testshop1.bimmer-tech.net";
    } else {
      host = "https://www.bimmer-tech.net";
    }
    // this.getReviews();
    // this.getposts();
    this.postsToShowBar = (this.postsToShow * 100) / this.posts.length;

    //        if(this.$route.query.promo == 'xmas22'){
    if (moment("2022-12-31", "YYYY-MM-DD").diff(moment(), "days") > -1) {
      this.isSaleActive = false;
      this.banner = "./assets/promo-sale/img/xmas-22-banner.png";
      this.promoBanner = "./assets/promo-sale/img/xmas-22-sale.png";
      document.body.classList.add("show-xmas22");
    }
    //        }

    var targetDate = new Date("Tue, 28 Nov 2023 09:55:00 GMT");
    var targetUTCdateTime = new Date(targetDate.toUTCString());
    that.fb23preHeader =
      '<span class="bf23phblueHeading">ONLY <span class="cb-timer-23"></span> <span class="bf23phst">TILL THE END. DON\'T MISS IT!</span></span>';
    that.fb23preHeader = "";
    if (this.isSaleActive) {
      this.banner = "./assets/img/banner-bf24.png";
    }
  },
  methods: {
    scrollToId: function (id) {
      var header = 70;
      setTimeout(function () {
        var elmnt = document.getElementById(id);
        if (elmnt) {
          elmnt.scrollIntoView();
        }
        if ($("#" + id).length) {
          $("html, body").animate(
            { scrollTop: $("#" + id).offset().top - header },
            "fast"
          );
        }
      }, 100);
    },
    isMobileDevice: function () {
      // Use window.innerWidth or window.matchMedia to check for mobile devices
      return window.innerWidth <= 768; // Adjust the threshold as needed
    },
    multipleFilters: function (data) {
      var that = this;
      var filters = data.split(",");
      filters.forEach(function (value) {
        if (value) {
          that.productFilter(value);
        }
      });
    },
    checkVin: function (a) {
      var that = this;
      that.personelDetails = true;
      that.productList = [];
      that.showDetails = "";
      that.vin = that.vin.toUpperCase();
      var vinParam = that.vin;
      if (this.vin.length > 0) {
        if (that.vin.includes("*******")) {
          vinParam = that.vin.substr(that.vin.length - 7);
        }
        var params = new URLSearchParams();
        params.append("vin", vinParam);
        that.loading = true;
        that.progressBar();
        that.vinSeries = "";
        that.includeEthAdapter.stock = false;
        that.includeEthAdapter.added = false;
        that.includeEthAdapter.type = "";
        //                var vinUrl = 'sendRequest.php?function=decodeByVin';
        var vinUrl = that.preUrl + "/api2/extender/vinchck/idrive";
        axios
          .post(vinUrl, params)
          .then(function (response) {
            that.cartProducts = [];
            that.wifiAntennaCompatible = false;
            that.includeCable = false;
            that.showCable = false;
            if (response.status == 200 && response.data.vinData) {
              if (that.$route.query.vin) {
                that.$route.query.vin = that.$route.query.vin.toUpperCase();
              }
              if (that.vin) {
                that.vin = that.vin.toUpperCase();
              }
              if (that.vin && that.vin != that.$route.query.vin) {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push(
                  { event: "decode_vin" },
                  { decode_vin: that.vin }
                );
              }
              if (that.vin && that.vin == that.$route.query.vin) {
                that.$route.query.vin = "";
              }
              that.fullVin = response.data.vinData.VIN;
              var trimedVin = that.fullVin;
              if (trimedVin.length > 7 && that.vin != that.fullVin) {
                trimedVin =
                  that.fullVin.substring(0, 3) +
                  "*******" +
                  that.fullVin.substr(that.fullVin.length - 7);
              }
              that.vin = trimedVin;
              that.vinSeries = response.data.vinData["E series"];
              that.vinSet = true;
              that.searchProductVinId = "";
              that.topSeller = 0;
              if (response.data.products) {
                that.productList = [];
                var vinProducts = response.data.products;
                that.filterType = "all";
                that.carHeadUnit = response.data.vinData.head_unit;
                that.vinProducts = vinProducts;
                //console.log(JSON.stringify(vinProducts[vinProducts.length-1]),JSON.stringify(products[products.length-1]));
                // console.log(products);
                if (vinProducts.length > 0) {
                  for (var i = 0; i < vinProducts.length; i++) {
                    //                                    console.log("id: "+vinProducts[i].id+" name: "+vinProducts[i].name);
                    if (vinProducts[i].id == 117) {
                      that.wifiAntennaCompatible = true;
                    }
                    if (vinProducts[i].id == 415) {
                      that.includeEthAdapter.stock = true;
                    }
                    //                                    console.log(vinProducts[i].id+" -> "+vinProducts[i].custom[0].cable);
                    //                                    if(vinProducts[i].custom[0].cable == 'false'){
                    for (var j = 0; j < products.length; j++) {
                      if (vinProducts[i].id == products[j].vinCheckId) {
                        // console.log(vinProducts[i].id+" -> "+products[j].vinCheckId+" -> "+vinProducts[i].custom[0].cable);
                        // console.log(products[j], vinProducts[i].id+" -> "+products[j].vinCheckId+" -> "+vinProducts[i].custom[0].cable);
                        let vinCable = "";
                        if (vinProducts[i].custom !== undefined)
                          for (
                            var a = 0;
                            a < vinProducts[i].custom.length;
                            a++
                          ) {
                            if (vinProducts[i].custom[a].cable !== undefined)
                              if (vinProducts[i].custom[a].cable) {
                                vinCable = vinProducts[i].custom[a].cable;
                              }
                          }
                        if (
                          (vinCable == "false" && !products[j].cable) ||
                          (vinCable == "true" && products[j].cable) ||
                          products[j].custom == true
                        ) {
                          //Search by shopId starts
                          if (that.searchProductId) {
                            if (products[j].shopId) {
                              if (that.searchProductId == products[j].shopId) {
                                that.showDetails = products[j].id;
                                that.searchProductVinId =
                                  products[j].vinCheckId;
                                scroll = true;
                              }
                            } else if (products[j].shopIds) {
                              for (
                                var sid = 0;
                                sid < products[j].shopIds.length;
                                sid++
                              ) {
                                if (
                                  that.searchProductId ==
                                  products[j].shopIds[sid].shopId
                                ) {
                                  that.showDetails = products[j].id;
                                  that.searchProductVinId =
                                    products[j].vinCheckId;
                                  scroll = true;
                                }
                              }
                            }
                          }
                          //Search by shopId ends

                          if (
                            that.filters["sound"] == false &&
                            that.filters["infotainment"] == false &&
                            that.filters["doors_trunk"] == false &&
                            that.filters["navigation"] == false &&
                            that.filters["display"] == false &&
                            that.filters["service_diagnostic"] == false &&
                            that.filters["video"] == false &&
                            that.filters["control"] == false
                          ) {
                            //console.log(products[j])
                            var curProduct = products[j];
                            if (vinProducts[i].originalPrice) {
                              curProduct.originalPrice =
                                vinProducts[i].originalPrice / 100;
                            } else {
                              curProduct.originalPrice = products[j].price;
                            }

                            if (curProduct.descriptionFunction) {
                              curProduct.description = products[
                                j
                              ].descriptionFunction(
                                products[j].needWiFiAntenna,
                                products[j].fullScreenExist
                              );
                            }
                            if (curProduct.descriptionFnction) {
                              curProduct.description = products[
                                j
                              ].descriptionFnction(that.carHeadUnit);
                            } else if (products[j].androidMirroring) {
                              curProduct.description =
                                products[j].full_description;
                            }
                            if (vinProducts[i].price) {
                              curProduct.price = vinProducts[i].price / 100;
                            }
                            if (curProduct.priceFunction) {
                              if (that.carHeadUnit) {
                                curProduct.price = products[j].priceFunction(
                                  that.carHeadUnit
                                );
                              } else {
                                curProduct.price =
                                  products[j].priceFunction("NBT");
                              }
                              if (that.isSaleActive) {
                                var newPrice = curProduct.price;
                                newPrice = (newPrice / 100) * 90;
                                curProduct.price = newPrice;
                              }
                            }
                            if (
                              products[j].id == "video_in_motion" ||
                              products[j].id == "apple_car_play_activation" ||
                              products[j].id == "enhanced_bluetooth" ||
                              products[j].id == "legal_disclaimer_deactivation"
                            ) {
                              that.topSeller++;
                            }
                            curProduct.selected = false;
                            that.productList.push(curProduct);
                            //console.log(curProduct, curProduct.priceFunction)
                          } else {
                            if (products[j]["filters"]) {
                              if (
                                (that.filters["sound"] == true &&
                                  products[j]["filters"]["sound"]) ||
                                (that.filters["infotainment"] == true &&
                                  products[j]["filters"]["infotainment"]) ||
                                (that.filters["doors_trunk"] == true &&
                                  products[j]["filters"]["doors_trunk"]) ||
                                (that.filters["navigation"] == true &&
                                  products[j]["filters"]["navigation"]) ||
                                (that.filters["display"] == true &&
                                  products[j]["filters"]["display"]) ||
                                (that.filters["service_diagnostic"] == true &&
                                  products[j]["filters"][
                                    "service_diagnostic"
                                  ]) ||
                                (that.filters["video"] == true &&
                                  products[j]["filters"]["video"]) ||
                                (that.filters["control"] == true &&
                                  products[j]["filters"]["control"])
                              ) {
                                var curProduct = products[j];
                                if (vinProducts[i].originalPrice) {
                                  curProduct.originalPrice =
                                    vinProducts[i].originalPrice / 100;
                                } else {
                                  curProduct.originalPrice = products[j].price;
                                }
                                if (curProduct.descriptionFnction) {
                                  curProduct.description = products[
                                    j
                                  ].descriptionFnction(that.carHeadUnit);
                                } else if (products[j].androidMirroring) {
                                  curProduct.description =
                                    products[j].full_description;
                                }
                                if (vinProducts[i].price) {
                                  curProduct.price = vinProducts[i].price / 100;
                                }
                                if (curProduct.priceFunction) {
                                  if (that.carHeadUnit) {
                                    curProduct.price = products[
                                      j
                                    ].priceFunction(that.carHeadUnit);
                                  } else {
                                    curProduct.price =
                                      products[j].priceFunction("NBT");
                                  }
                                  if (that.isSaleActive) {
                                    var newPrice = curProduct.price;
                                    newPrice = (newPrice / 100) * 90;
                                    curProduct.price = newPrice;
                                  }
                                }

                                if (
                                  products[j].id == "video_in_motion" ||
                                  products[j].id ==
                                    "apple_car_play_activation" ||
                                  products[j].id == "enhanced_bluetooth" ||
                                  products[j].id ==
                                    "legal_disclaimer_deactivation"
                                ) {
                                  that.topSeller++;
                                }
                                curProduct.selected = false;
                                that.productList.push(curProduct);
                              }
                            }
                          }
                        }
                        //                                                console.log(products[j].vinCheckId +" --> "+vinProducts[i]);
                      }
                    }
                    //                                    }
                  }
                  that.progressBar();
                  that.sortMethod(that.sort);
                  if (that.$route.query.type) {
                    that.productFilterType(that.$route.query.type);
                    that.$route.query.type = "";
                  }
                }
              }
            } else {
              that.productList = products;
              that.vinSet = false;
              that.vin = "";
              that.fullVin = "";
              toastr.error(
                "Something went wrong, please <b><u>check you VIN</b></u> and try again",
                "",
                {
                  onclick: function () {
                    var elmnt = document.getElementById("check-vin-section");
                    elmnt.scrollIntoView();
                  },
                }
              );
            }
          })
          .finally(function () {
            that.loading = false;
            setTimeout(function () {
              AOS.init({ once: true });
            }, 100);
            //Search by shopId starts
            if (
              that.searchProductId &&
              that.searchProductVinId == "" &&
              that.showDetails == "" &&
              that.vinSet
            ) {
              var productName = "";
              for (var j = 0; j < products.length; j++) {
                if (products[j].shopId) {
                  if (that.searchProductId == products[j].shopId) {
                    productName = products[j].name;
                    break;
                  }
                } else if (products[j].shopIds) {
                  for (var sid = 0; sid < products[j].shopIds.length; sid++) {
                    if (
                      that.searchProductId == products[j].shopIds[sid].shopId
                    ) {
                      productName = products[j].name;
                      break;
                    }
                  }
                }
              }
              that.searchProductId = "";
              if (productName) {
                toastr.remove();
                toastr.error(
                  "<b>" +
                    productName +
                    "</b> is not compatible with VIN <b>" +
                    that.$route.query.vin +
                    "</b>"
                );
              }
            }
            if (that.vin.length > 6) {
              //Search by shopId ends
              if (a == "scroll" || scroll) {
                var elmnt = document.getElementById("category-filter");
                elmnt.scrollIntoView();
              }
            }
          });
      } else {
        toastr.remove();
        toastr.error(
          "Your Vin is incorrect, <b><u>please check it</b></u> and try again",
          "",
          {
            onclick: function () {
              var elmnt = document.getElementById("check-vin-section");
              elmnt.scrollIntoView();
            },
          }
        );
      }
    },
    loadMore: function () {
      if (this.productsToShow + 15 < this.productList.length) {
        this.productsToShow += 15;
      } else {
        this.productsToShow = this.productList.length;
      }
      this.productsToShowBar =
        (this.productsToShow * 100) / this.productList.length;
      setTimeout(function () {
        AOS.init({ once: true });
      }, 100);
    },
    calculateTotal: function () {
      this.showCable = false;
      this.showCableCheckbox = false;
      this.addedWifi = false;
      this.addedWifiProductId = 0;
      this.totalCartPrice = 0;
      //            console.log(this.cartProducts);
      let that = this;
      if (this.includeCable) {
        if (this.isSaleActive) {
          that.totalCartPrice += 44.1;
        } else {
          that.totalCartPrice += 49;
        }
      }
      for (var i = 0; i < that.cartProducts.length; i++) {
        if (that.cartProducts[i].addedWifi == true) {
          that.addedWifi = true;
          that.addedWifiProductId = that.cartProducts[i].productIdName;
          //                    that.cartProducts[i].productPrice += 99;
        }
        that.totalCartPrice += that.cartProducts[i].productPrice;
        if (
          that.cartProducts[i].cable == 1 ||
          that.cartProducts[i].isCable == 1
        ) {
          that.showCable = true;
        }
      }
      if (
        this.includeEthAdapter.added &&
        this.includeEthAdapter.stock &&
        this.includeEthAdapter.type &&
        this.showCable
      ) {
        if (this.isSaleActive) {
          that.totalCartPrice += that.includeEthAdapter.price;
        } else {
          that.totalCartPrice += that.includeEthAdapter.orignalPrice;
        }
      } else {
        that.includeEthAdapter.added = false;
        that.includeEthAdapter.type = "";
      }
      that.totalCartPrice = that.totalCartPrice.toFixed(2);
      if (this.showCable && this.vinSeries.match(/[ER][0-9]{2}/)) {
        that.showCableCheckbox = true;
      }
    },
    selectProduct: function (id) {
      var that = this;
      var index = "";
      var revertFilter = [];
      if (that.vinSet && that.vin.length > 4) {
        that.productLoading = true;
        that.productLoadingId = id;
        if (
          that.filters["sound"] == true ||
          that.filters["infotainment"] == true ||
          that.filters["doors_trunk"] == true ||
          that.filters["navigation"] == true ||
          that.filters["display"] == true ||
          that.filters["service_diagnostic"] == true ||
          that.filters["video"] == true ||
          that.filters["control"] == true
        ) {
          if (that.filters["control"] == true) {
            revertFilter.push("control");
          }
          if (that.filters["display"] == true) {
            revertFilter.push("display");
          }
          if (that.filters["doors_trunk"] == true) {
            revertFilter.push("doors_trunk");
          }
          if (that.filters["infotainment"] == true) {
            revertFilter.push("infotainment");
          }
          if (that.filters["navigation"] == true) {
            revertFilter.push("navigation");
          }
          if (that.filters["service_diagnostic"] == true) {
            revertFilter.push("service_diagnostic");
          }
          if (that.filters["sound"] == true) {
            revertFilter.push("sound");
          }
          if (that.filters["video"] == true) {
            revertFilter.push("video");
          }
          that.productFilter();
        }
        for (var i = 0; i < that.productList.length; i++) {
          if (that.productList[i].id === id) {
            if (
              that.productList[i].selected ||
              that.productList[i].selected == true
            ) {
              that.productList[i].selected = false;
              for (var j = 0; j < that.cartProducts.length; j++) {
                if (that.cartProducts[j].productIdName == id) {
                  that.cartProducts.splice(j, 1);
                }
              }
              that.cartTotal = that.cartTotal - that.productList[i].price;
              that.productLoading = false;
              that.productLoadingId = "";
              if (revertFilter.length > 0) {
                for (var r = 0; r < revertFilter.length; r++) {
                  that.filters[revertFilter[r]] = true;
                }
                that.filterVin();
              }
              toastr.remove();
              toastr.success("Product removed from cart.");
            } else {
              let cable = 0;
              if (that.productList[i].cable) {
                cable = 1;
              }
              let selectedProductId = "";
              if (that.productList[i].shopIds) {
                if (
                  that.productList[i].needWiFiFunction &&
                  !that.wifiAntennaCompatible
                ) {
                  that.productList[i].addedWifi = false;
                  for (
                    var dd = 0;
                    dd < that.productList[i].shopIds.length;
                    dd++
                  ) {
                    if (
                      that.productList[i].shopIds[dd].name !=
                      "With WiFi antenna (+$99)"
                    ) {
                      that.productList[i].optSelected =
                        that.productList[i].shopIds[dd].shopId;
                      break;
                    }
                  }
                }
                if (that.productList[i].optSelected) {
                  if (that.productList[i].optSelected.shopId) {
                    selectedProductId = that.productList[i].optSelected.shopId;
                  } else {
                    selectedProductId = that.productList[i].optSelected;
                  }
                  var addWifi = false;
                  if (
                    that.productList[i].addedWifi &&
                    this.addedWifiProductId == 0
                  ) {
                    addWifi = that.productList[i].addedWifi;
                  }
                  that.cartProducts.push({
                    productId: selectedProductId,
                    variantId: selectedProductId,
                    productName: that.productList[i].name,
                    productPrice: that.productList[i].price,
                    productIdName: that.productList[i].id,
                    productIcon: that.productList[i].icon,
                    addedWifi: addWifi,
                    warranty: 0,
                    savePrice: 0,
                    isCable: 0,
                    cable: cable,
                  });
                  that.cartTotal = that.cartTotal + that.productList[i].price;
                  that.productList[i].selected = true;
                  that.productLoading = false;
                  that.productLoadingId = "";
                  if (revertFilter.length > 0) {
                    for (var r = 0; r < revertFilter.length; r++) {
                      that.filters[revertFilter[r]] = true;
                    }
                    that.filterVin();
                  }
                  toastr.remove();
                  toastr.success("Product added to <b><u>cart</u></b>.", "", {
                    onclick: function () {
                      var elmnt = document.getElementById("selected-upgrades");
                      elmnt.scrollIntoView();
                    },
                  });
                } else {
                  that.productLoading = false;
                  that.productLoadingId = "";
                  if (revertFilter.length > 0) {
                    for (var r = 0; r < revertFilter.length; r++) {
                      that.filters[revertFilter[r]] = true;
                    }
                    that.filterVin();
                  }
                  toastr.remove();
                  toastr.warning("Please select option from dropdown!");
                }
              } else {
                if (
                  that.productList[i].custom &&
                  !that.productList[i].dropdown
                ) {
                  index = i;
                  //  debugger;
                  axios
                    .get(
                      that.preUrl +
                        "/api2/product/" +
                        that.productList[i].shopId,
                      { headers: { "Access-Control-Allow-Origin": "*" } }
                    )
                    .then(function (response) {
                      if (response) {
                        if (response.data.dropDown) {
                          that.productList[i].variantId = response.data.code;
                          that.productList[i].dropdown = response.data.dropDown;
                          if (revertFilter.length > 0) {
                            for (var r = 0; r < revertFilter.length; r++) {
                              that.filters[revertFilter[r]] = true;
                            }
                            that.filterVin();
                          }
                          toastr.remove();
                          toastr.warning("Please select options to proceed.");
                        }
                      }
                      that.productLoading = false;
                      that.productLoadingId = "";
                      setTimeout(function () {
                        AOS.init({ once: true });
                      }, 100);
                    })
                    .catch(function (error) {
                      console.log(error);
                      toastr.remove();
                      if (that.debugMode) {
                        that.productList[i].variantId = "MapUpdateNextNBT";
                        that.productList[i].dropdown = [
                          {
                            id: 8,
                            name: "Subscription option:",
                            code: "Subscription option:",
                            selectedOption: 37,
                            options: [
                              {
                                id: 37,
                                name: "One time",
                                price: null,
                                position: 1,
                              },
                              {
                                id: 38,
                                name: "+1 year",
                                price: 3500,
                                position: 2,
                              },
                              {
                                id: 39,
                                name: "+2 years",
                                price: 7000,
                                position: 3,
                              },
                            ],
                          },
                          {
                            id: 37,
                            name: "Region:",
                            code: "maps_next",
                            selectedOption: 220,
                            options: [
                              {
                                id: 220,
                                name: "North America 2019-2",
                                price: null,
                                position: 1,
                              },
                              {
                                id: 221,
                                name: "Argentina 2019",
                                price: 5000,
                                position: 2,
                              },
                              {
                                id: 222,
                                name: "Australia/New Zealand 2019",
                                price: 5000,
                                position: 3,
                              },
                              {
                                id: 223,
                                name: "China (Hongkong Macao) 2018-3",
                                price: 5000,
                                position: 4,
                              },
                              {
                                id: 224,
                                name: "Europe 2019-1",
                                price: 5000,
                                position: 5,
                              },
                              {
                                id: 225,
                                name: "India 2019-2",
                                price: 5000,
                                position: 6,
                              },
                              {
                                id: 226,
                                name: "Israel 2019",
                                price: 5000,
                                position: 7,
                              },
                              {
                                id: 227,
                                name: "Japan 2019",
                                price: 5000,
                                position: 8,
                              },
                              {
                                id: 228,
                                name: "Korea 2018-1",
                                price: 5000,
                                position: 9,
                              },
                              {
                                id: 229,
                                name: "Middle East 2019",
                                price: 5000,
                                position: 10,
                              },
                              {
                                id: 230,
                                name: "Northern Africa 2019",
                                price: 5000,
                                position: 11,
                              },
                              {
                                id: 231,
                                name: "South America 2019",
                                price: 5000,
                                position: 12,
                              },
                              {
                                id: 232,
                                name: "Southeast Asia 2018-2",
                                price: 5000,
                                position: 13,
                              },
                              {
                                id: 233,
                                name: "Southern Africa 2019",
                                price: 5000,
                                position: 14,
                              },
                              {
                                id: 234,
                                name: "Taiwan 2019-1",
                                price: 5000,
                                position: 15,
                              },
                              {
                                id: 235,
                                name: "Turkey 2019-2",
                                price: 5000,
                                position: 16,
                              },
                            ],
                          },
                        ];
                        toastr.error(
                          "Something went wrong,<br> Couldn't get data from the server"
                        );
                        toastr.info("Static data added for testing");
                        toastr.warning("Please select options to proceed.");
                      } else {
                        toastr.error("Something went wrong, try again!");
                      }
                      that.productLoading = false;
                      that.productLoadingId = "";
                      setTimeout(function () {
                        AOS.init({ once: true });
                      }, 100);
                    });
                  break;
                } else {
                  if (that.productList[i].shopId) {
                    selectedProductId = that.productList[i].shopId;
                  }
                  var sportDisplayDuplicate = false;
                  if (
                    selectedProductId == 380 ||
                    selectedProductId == 370 ||
                    selectedProductId == 300 ||
                    selectedProductId == 286
                  ) {
                    for (var j = 0; j < that.cartProducts.length; j++) {
                      if (
                        that.cartProducts[j].variantId == 380 ||
                        that.cartProducts[j].variantId == 370 ||
                        that.cartProducts[j].variantId == 300 ||
                        that.cartProducts[j].variantId == 286
                      ) {
                        toastr.remove();
                        toastr.warning(
                          "Sorry, we can only code one of Sport Display and M-Sport Display. Please select one for your order."
                        );
                        sportDisplayDuplicate = true;
                        break;
                      }
                    }
                  }
                  if (sportDisplayDuplicate == false) {
                    var dropdown = [];
                    var variantId = selectedProductId;
                    if (that.productList[i].dropdown) {
                      for (
                        var d = 0;
                        d < that.productList[i].dropdown.length;
                        d++
                      ) {
                        dropdown.push(
                          that.productList[i].dropdown[d].selectedOption
                        );
                      }
                    }
                    if (that.productList[i].variantId) {
                      variantId = that.productList[i].variantId;
                    }
                    var addWifi = false;
                    if (
                      that.productList[i].addedWifi &&
                      this.addedWifiProductId == 0
                    ) {
                      addWifi = that.productList[i].addedWifi;
                    }
                    //debugger;
                    that.cartProducts.push({
                      productId: selectedProductId,
                      variantId: variantId,
                      productName: that.productList[i].name,
                      productPrice: that.productList[i].price,
                      productIdName: that.productList[i].id,
                      dropDown: dropdown,
                      dropDownDetails: that.productList[i].dropdown,
                      productIcon: that.productList[i].icon,
                      addedWifi: addWifi,
                      warranty: 0,
                      savePrice: 0,
                      isCable: 0,
                      cable: cable,
                    });
                    that.cartTotal = that.cartTotal + that.productList[i].price;
                    that.productList[i].selected = true;
                    if (revertFilter.length > 0) {
                      for (var r = 0; r < revertFilter.length; r++) {
                        that.filters[revertFilter[r]] = true;
                      }
                      that.filterVin();
                    }
                    toastr.remove();
                    toastr.success("Product added to <b><u>cart</u></b>.", "", {
                      onclick: function () {
                        var elmnt =
                          document.getElementById("selected-upgrades");
                        elmnt.scrollIntoView();
                      },
                    });
                  }
                  that.productLoading = false;
                  that.productLoadingId = "";
                }
              }
            }
            break;
          }
        }
        that.includeCable = false;
        for (var cp = 0; cp < that.cartProducts.length; cp++) {
          if (that.cartProducts[cp].isCable || that.cartProducts[cp].cable) {
            that.includeCable = true;
            break;
          }
        }
      } else {
        toastr.remove();
        toastr.warning("Please <b><u>enter your VIN</b></u> first!", "", {
          onclick: function () {
            var elmnt = document.getElementById("check-vin-section");
            elmnt.scrollIntoView();
          },
        });
      }
      setTimeout(function () {
        AOS.init({ once: true });
      }, 100);
      this.calculateTotal();
    },
    showProductDetails: function (id) {
      this.showDetails = id;
      setTimeout(function () {
        var offset = 100;
        var el = document.getElementById(id);
        window.scroll({
          top: el.offsetTop - offset,
          left: 0,
          behavior: "smooth",
        });
        AOS.init({ once: true });
      }, 100);
    },
    showMore: function (id) {
      if (this.showDetails == id) {
        this.showDetails = "";
        setTimeout(function () {
          AOS.init({ once: true });
        }, 100);
      } else {
        this.showDetails = id;
        //                var elmnt = document.getElementById(id);elmnt.scrollIntoView();

        setTimeout(function () {
          var offset = 100;
          var el = document.getElementById(id);
          window.scroll({
            top: el.offsetTop - offset,
            left: 0,
            behavior: "smooth",
          });
          AOS.init({ once: true });
        }, 100);
      }
    },
    gotoCheckout: function () {
      var that = this;
      if (that.showCableCheckbox && !that.cableCheckbox) {
        toastr.remove();
        toastr.error("Please accept terms to proceed!");
        return;
      }
      if (that.acceptTerms) {
        if (that.minimumAmount <= that.cartTotal) {
          that.loading = true;
          if (that.includeCable) {
            that.cartTotal = that.cartTotal + 49;
            that.cartProducts.push({
              productId: 165,
              variantId: 165,
              productName: "49 Cable",
              productPrice: 49,
              productIdName: "49-cable",
              warranty: 0,
              savePrice: 0,
              isCable: 1,
            });
          }
          if (that.addedWifi) {
            that.cartProducts.push({
              productId: "wifi",
              variantId: "wifi",
              productName: "Wifi Antena",
              productPrice: 99,
              productIdName: "wifi-antena",
              warranty: 0,
              savePrice: 0,
              isCable: 0,
            });
          }
          if (that.includeEthAdapter.added) {
            that.cartTotal = that.cartTotal + that.includeEthAdapter.price;
            var ethId = 1215;
            if (that.includeEthAdapter.type == "A") {
              ethId = 305;
            }
            if (that.includeEthAdapter.type == "C") {
              ethId = 306;
            }
            that.cartProducts.push({
              productId: "Ethernet_adapter",
              variantId: "Ethernet_adapter",
              productName:
                that.includeEthAdapter.price +
                " Ethernet adapter + USB Type " +
                that.includeEthAdapter.type,
              productPrice: that.includeEthAdapter.price,
              productIdName: "1215-cable",
              warranty: 0,
              savePrice: 0,
              isCable: 1,
              dropDown: [ethId],
            });
          }
          let data = {
            data: that.cartProducts,
            from: "idrive",
            cartId: that.cartId,
          };
          axios
            .post(that.preUrl + "/api2/cart/add", data)
            .then(function (responseData) {
              let response = responseData.data;
              if (response.cart_id) {
                var vinParam = that.fullVin;
                if (that.fullVin != that.vin) {
                  vinParam = that.fullVin.substr(that.fullVin.length - 7);
                }
                const url =
                  that.preUrl +
                  "/cart?cartId=" +
                  response.cart_id +
                  "&from=idrive&vin=" +
                  vinParam +
                  "&ref=" +
                  encodeURI(window.location.href);
                window.location.href = url;
              }
            })
            .catch((error) => {
              if (that.includeCable) {
                that.gotoCartError("49-cable");
              }
              if (that.addedWifi) {
                that.gotoCartError("wifi-antena");
              }
              if (that.includeEthAdapter.added) {
                that.gotoCartError("1215-cable");
              }
              if (that.debugMode) {
                console.log(error);
                toastr.error(error);
              } else {
                toastr.error("Something went wrong, please try again");
              }
            })
            .finally(function () {
              that.loading = false;
            });
        } else {
          toastr.remove();
          if (that.includeCable) {
            toastr.warning(
              "Minimum order amount is $" +
                that.minimumAmount +
                ", excluding $49 cable."
            );
          } else {
            toastr.warning("Minimum order amount is $" + that.minimumAmount);
          }
        }
      } else {
        toastr.remove();
        toastr.error("Please accept terms to proceed!");
      }
    },
    gotoCartError: function (id) {
      let that = this;
      for (var j = 0; j < that.cartProducts.length; j++) {
        if (that.cartProducts[j].productIdName == id) {
          //                    toastr.info('removing from cart '+ j +that.cartProducts[j].productIdName);
          that.cartProducts.splice(j, 1);
          break;
        }
      }
    },
    productFilter: function (filter) {
      if (filter) {
        if (this.filters[filter] == false) {
          this.filters[filter] = true;
        } else {
          this.filters[filter] = false;
        }
        if (this.vinSet == true) {
          this.filterVin("scroll");
        } else {
          this.filterNonVin();
        }
      } else {
        this.filters["sound"] = false;
        this.filters["infotainment"] = false;
        this.filters["doors_trunk"] = false;
        this.filters["navigation"] = false;
        this.filters["display"] = false;
        this.filters["service_diagnostic"] = false;
        this.filters["video"] = false;
        this.filters["control"] = false;
        this.filterType = "all";
        if (this.vinSet == true) {
          this.filterVin("scroll");
        } else {
          this.loadStartUp();
        }
      }
      this.sortMethod(this.sort);
    },
    productFilterType: function (type) {
      if (type != "usb" && type != "cable") {
        type = "all";
      }
      this.filterType = type;
      if (this.vin && this.vinSet) {
        this.filterVin();
      } else {
        this.filterNonVin();
      }
      //            var newList = [];
      //            for(var j=0;j<that.productList.length;j++){
      //                if(type == 'all'){
      //                    newList.push(that.productList[j]);
      //                }
      //                else if(type == 'usb' && !that.productList[j].cable){
      //                    newList.push(that.productList[j]);
      //                }else if(type == 'cable' && that.productList[j].cable){
      //                    newList.push(that.productList[j]);
      //                }
      //            }
      //            that.productList = [];
      //            that.productList = newList;
    },
    filterNonVin: function () {
      var that = this;
      try {
        that.productList = [];
        that.topSeller = 0;
        if (
          that.filters["sound"] == true ||
          that.filters["infotainment"] == true ||
          that.filters["doors_trunk"] == true ||
          that.filters["navigation"] == true ||
          that.filters["display"] == true ||
          that.filters["service_diagnostic"] == true ||
          that.filters["video"] == true ||
          that.filters["control"] == true
        ) {
          for (var j = 0; j < products.length; j++) {
            if (products[j]["filters"] && products[j].showOnStartUp) {
              if (
                (that.filters["sound"] == true &&
                  products[j]["filters"]["sound"]) ||
                (that.filters["infotainment"] == true &&
                  products[j]["filters"]["infotainment"]) ||
                (that.filters["doors_trunk"] == true &&
                  products[j]["filters"]["doors_trunk"]) ||
                (that.filters["navigation"] == true &&
                  products[j]["filters"]["navigation"]) ||
                (that.filters["display"] == true &&
                  products[j]["filters"]["display"]) ||
                (that.filters["service_diagnostic"] == true &&
                  products[j]["filters"]["service_diagnostic"]) ||
                (that.filters["video"] == true &&
                  products[j]["filters"]["video"]) ||
                (that.filters["control"] == true &&
                  products[j]["filters"]["control"])
              ) {
                if (
                  products[j].id == "video_in_motion" ||
                  products[j].id == "apple_car_play_activation" ||
                  products[j].id == "enhanced_bluetooth" ||
                  products[j].id == "legal_disclaimer_deactivation"
                ) {
                  that.topSeller++;
                }
                if (that.filterType == "all") {
                  that.productList.push(products[j]);
                } else if (that.filterType == "usb" && !products[j].cable) {
                  that.productList.push(products[j]);
                } else if (that.filterType == "cable" && products[j].cable) {
                  that.productList.push(products[j]);
                }
              }
            }
          }
        } else {
          that.loadStartUp();
        }
        that.progressBar();
        setTimeout(function () {
          AOS.init({ once: true });
        }, 100);
        if (that.$route.query.category || that.$route.query.type) {
          setTimeout(function () {
            var elmnt = document.getElementById("categories");
            elmnt.scrollIntoView();
            that.$route.query.category = "";
            that.$route.query.type = "";
          }, 1300);
        }
      } catch (e) {
        console.log("error --> " + e);
      }
    },
    filterVin: function () {
      var that = this;
      var vinProducts = that.vinProducts;
      that.productList = [];
      that.topSeller = 0;
      if (vinProducts.length > 0) {
        for (var i = 0; i < vinProducts.length; i++) {
          //                    console.log(vinProducts[i].id+" -> "+vinProducts[i].custom[0].cable);
          //                    if(vinProducts[i].custom[0].cable == 'false'){
          for (var j = 0; j < products.length; j++) {
            if (vinProducts[i].id == products[j].vinCheckId) {
              let vinCable = "";
              for (var a = 0; a < vinProducts[i].custom.length; a++) {
                if (vinProducts[i].custom[a].cable) {
                  vinCable = vinProducts[i].custom[a].cable;
                }
              }
              if (
                (vinCable == "false" && !products[j].cable) ||
                (vinCable == "true" && products[j].cable) ||
                products[j].custom == true
              ) {
                if (
                  that.filters["sound"] == false &&
                  that.filters["infotainment"] == false &&
                  that.filters["doors_trunk"] == false &&
                  that.filters["navigation"] == false &&
                  that.filters["display"] == false &&
                  that.filters["service_diagnostic"] == false &&
                  that.filters["video"] == false &&
                  that.filters["control"] == false
                ) {
                  if (
                    products[j].id == "video_in_motion" ||
                    products[j].id == "apple_car_play_activation" ||
                    products[j].id == "enhanced_bluetooth" ||
                    products[j].id == "legal_disclaimer_deactivation"
                  ) {
                    that.topSeller++;
                  }
                  if (that.filterType == "all") {
                    that.productList.push(products[j]);
                  } else if (that.filterType == "usb" && !products[j].cable) {
                    that.productList.push(products[j]);
                  } else if (that.filterType == "cable" && products[j].cable) {
                    that.productList.push(products[j]);
                  }
                } else {
                  if (products[j]["filters"]) {
                    if (
                      (that.filters["sound"] == true &&
                        products[j]["filters"]["sound"]) ||
                      (that.filters["infotainment"] == true &&
                        products[j]["filters"]["infotainment"]) ||
                      (that.filters["doors_trunk"] == true &&
                        products[j]["filters"]["doors_trunk"]) ||
                      (that.filters["navigation"] == true &&
                        products[j]["filters"]["navigation"]) ||
                      (that.filters["display"] == true &&
                        products[j]["filters"]["display"]) ||
                      (that.filters["service_diagnostic"] == true &&
                        products[j]["filters"]["service_diagnostic"]) ||
                      (that.filters["video"] == true &&
                        products[j]["filters"]["video"]) ||
                      (that.filters["control"] == true &&
                        products[j]["filters"]["control"])
                    ) {
                      if (
                        products[j].id == "video_in_motion" ||
                        products[j].id == "apple_car_play_activation" ||
                        products[j].id == "enhanced_bluetooth" ||
                        products[j].id == "legal_disclaimer_deactivation"
                      ) {
                        that.topSeller++;
                      }
                      if (that.filterType == "all") {
                        that.productList.push(products[j]);
                      } else if (
                        that.filterType == "usb" &&
                        !products[j].cable
                      ) {
                        that.productList.push(products[j]);
                      } else if (
                        that.filterType == "cable" &&
                        products[j].cable
                      ) {
                        that.productList.push(products[j]);
                      }
                    }
                  }
                }
              }
            }
          }
          //                    }
        }
        that.progressBar();
        that.sortMethod(that.sort);
        if (that.$route.query.category || that.$route.query.type) {
          setTimeout(function () {
            var elmnt = document.getElementById("categories");
            elmnt.scrollIntoView();
            that.$route.query.category = "";
            that.$route.query.type = "";
          }, 1300);
        }
      }
    },
    progressBar: function () {
      if (
        this.productList.length < 15 ||
        this.productsToShow >= this.productList.length
      ) {
        this.productsToShow = this.productList.length;
      } else if (this.productList.length > 15 && this.productsToShow < 15) {
        this.productsToShow = 15;
      }
      this.productsToShowBar =
        (this.productsToShow * 100) / this.productList.length;
    },
    sortMethod: function (type) {
      if (type == "asc") {
        this.sort = "asc";
        this.sortMessage =
          'Price <i class="icon-arrow-up font-weight-bold"></i>';
        this.productList.sort(function (a, b) {
          return parseFloat(a.price) - parseFloat(b.price);
        });
      } else if (type == "desc") {
        this.sort = "desc";
        this.sortMessage =
          'Price <i class="icon-arrow-down font-weight-bold"></i>';
        this.productList.sort(function (a, b) {
          return parseFloat(b.price) - parseFloat(a.price);
        });
      } else if (type == "a-z") {
        this.sort = "a-z";
        this.sortMessage =
          'A to Z <i class="icon-arrow-down font-weight-bold"></i>';
        function compare(a, b) {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        }
        return this.productList.sort(compare);
      } else if (type == "z-a") {
        this.sort = "z-a";
        this.sortMessage =
          'Z to A <i class="icon-arrow-up font-weight-bold"></i>';
        function compare(a, b) {
          if (a.name > b.name) return -1;
          if (a.name < b.name) return 1;
          return 0;
        }
        return this.productList.sort(compare);
      }
      setTimeout(function () {
        AOS.init({ once: true });
      }, 100);
    },
    loadStartUp: function () {
      //            this.productList = products;
      var that = this;
      var scroll = false;
      that.productList = [];
      that.topSeller = 0;
      for (var j = 0; j < products.length; j++) {
        if (products[j].showOnStartUp == true) {
          if (
            products[j].id == "video_in_motion" ||
            products[j].id == "apple_car_play_activation" ||
            products[j].id == "enhanced_bluetooth" ||
            products[j].id == "legal_disclaimer_deactivation"
          ) {
            that.topSeller++;
          }
          //                    that.productList.push(products[j]);

          if (that.filterType == "all") {
            that.productList.push(products[j]);
          } else if (that.filterType == "usb" && !products[j].cable) {
            that.productList.push(products[j]);
          } else if (that.filterType == "cable" && products[j].cable) {
            that.productList.push(products[j]);
          }
          //Search by shopId starts
          if (that.searchProductId) {
            if (products[j].shopId) {
              if (that.searchProductId == products[j].shopId) {
                that.showDetails = products[j].id;
                that.searchProductVinId = products[j].vinCheckId;
                scroll = true;
              }
            } else if (products[j].shopIds) {
              for (var sid = 0; sid < products[j].shopIds.length; sid++) {
                if (that.searchProductId == products[j].shopIds[sid].shopId) {
                  that.showDetails = products[j].id;
                  that.searchProductVinId = products[j].vinCheckId;
                  scroll = true;
                }
              }
            }
          }
          //Search by shopId ends
        }
      }
      if (scroll) {
        var elmnt = document.getElementById("category-filter");
        setTimeout(function () {
          elmnt.scrollIntoView();
        }, 500);
      }
    },
    toggleFilter: function () {
      if (this.showFilters) {
        this.showFilters = false;
      } else {
        this.showFilters = true;
      }
      setTimeout(function () {
        AOS.init({ once: true });
      }, 1005);
    },
    productOptSelection: function (id, option) {
      for (var j = 0; j < this.productList.length; j++) {
        if (this.productList[j].id == id) {
          var curProduct = this.productList[j];
          if (curProduct.descriptionFunction) {
            curProduct.description = this.productList[j].descriptionFunction(
              this.productList[j].needWiFiAntenna,
              this.productList[j].fullScreenExist
            );
          }
          if (curProduct.descriptionFnction) {
            curProduct.description = this.productList[j].descriptionFnction(
              this.carHeadUnit
            );
          } else if (this.productList[j].androidMirroring) {
            curProduct.description = this.productList[j].full_description;
          }

          if (curProduct.priceFunction) {
            if (this.carHeadUnit) {
              curProduct.price = this.productList[j].priceFunction(
                this.carHeadUnit
              );
            } else {
              curProduct.price = this.productList[j].priceFunction("NBT");
            }
            if (this.isSaleActive) {
              var newPrice = curProduct.price;
              newPrice = (newPrice / 100) * 90;
              curProduct.price = newPrice;
            }
          }
          if (curProduct.productPriceFunction) {
            curProduct.price = this.productList[j].productPriceFunction(
              option.shopId
            );
            if (this.isSaleActive) {
              var newPrice = curProduct.price;
              newPrice = (newPrice / 100) * 90;
              curProduct.price = newPrice;
            }
          }
          if (curProduct.needWiFiFunction) {
            if (option.name == "With WiFi antenna (+$99)") {
              curProduct.addedWifi = true;
            } else {
              curProduct.addedWifi = false;
            }
          }
          curProduct.beforeOptionsPrice = curProduct.price;
          this.productList[j] = curProduct;
          if (this.productList[j].selected) {
            this.selectProduct(this.productList[j].id);
            this.selectProduct(this.productList[j].id);
          }
          break;
        }
      }
    },
    productOptSelectionPrice: function (id, shopId) {
      for (var j = 0; j < this.productList.length; j++) {
        if (this.productList[j].id == id) {
          var curProduct = this.productList[j];
          if (!curProduct.dropdown.changed) {
            curProduct.dropdown.changed = true;
            curProduct.beforeOptionsPrice = curProduct.price;
          }
          var newPrice = curProduct.beforeOptionsPrice;
          for (var p = 0; p < curProduct.dropdown.length; p++) {
            var prodDropdown = curProduct.dropdown[p];
            for (var pOpt = 0; pOpt < prodDropdown.options.length; pOpt++) {
              if (
                prodDropdown.selectedOption == prodDropdown.options[pOpt].id &&
                prodDropdown.options[pOpt].price
              ) {
                newPrice = newPrice + prodDropdown.options[pOpt].price / 100;
              }
            }
          }
          curProduct.price = newPrice;
          this.productList[j] = curProduct;
          if (this.productList[j].selected) {
            this.selectProduct(this.productList[j].id);
            this.selectProduct(this.productList[j].id);
          }
          break;
        }
      }
    },
    clearVin: function () {
      this.vin = "";
      this.fullVin = "";
      this.vinSet = false;
      this.productFilter();
    },
    getReviews: function () {
      var that = this;
      axios
        .get(that.preUrl + "/api2/reviews/product/868")
        .then((response) => {
          if (response.data) {
            that.userReviews = response.data;
            that.calcReviews(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
          //                that.userReviews = staticData;
          //                that.calcReviews(staticData);
        });
    },
    calcReviews: function (data) {
      var that = this;
      that.userReviews = data;
      that.userReviewAvg = 0;
      for (var i = 0; i < that.userReviews.length; i++) {
        that.userReviewAvg += that.userReviews[i].rating;
      }

      that.userReviewAvg = (
        that.userReviewAvg / that.userReviews.length
      ).toFixed(1);
      that.showReviews = 6;
      if (that.showReviews > that.userReviews.length) {
        that.showReviews = that.userReviews.length;
      }
    },
    loadReviews: function () {
      this.showReviews += 6;
      if (this.showReviews > this.userReviews.length) {
        this.showReviews = this.userReviews.length;
      }
    },
    getposts: function () {
      var that = this;
      axios
        .get(that.preUrl + "/api2/blogs/by/category/2")
        .then((response) => {
          if (response.data) {
            var blogs = [];
            response.data.blogs.forEach(function (blog, blogI) {
              if (blog.lang == "en") {
                blogs.push(blog);
              }
            });
            that.posts = blogs;
            that.postsToShowBar = (that.postsToShow * 100) / that.posts.length;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      if (that.showReviews > that.userReviews.length) {
        that.showReviews = that.userReviews.length;
      }
    },
    loadPosts: function () {
      this.postsToShow += 6;
      if (this.postsToShow > this.posts.length) {
        this.postsToShow = this.posts.length;
      }
      this.postsToShowBar = (this.postsToShow * 100) / this.posts.length;
    },
    menuToggle: function () {
      $("#mySidenav").collapse("hide");
    },
    playVideo: function (url) {
      this.videoUrl = url;
    },
    stopVideo: function (url) {
      this.videoUrl = "";
    },
    addEthAdapter: function (type) {
      var that = this;
      if (that.includeEthAdapter.type == type) {
        that.includeEthAdapter.type = "";
        that.includeEthAdapter.added = false;
      } else {
        that.includeEthAdapter.type = type;
        that.includeEthAdapter.added = true;
      }
      that.calculateTotal();
      $("#ethModal").modal("hide");
    },
  },
  watch: {},
});
Vue.filter("dateFormat", function (value) {
  if (!value) return "";
  if (String(value).indexOf("-") < 0) {
    return moment.unix(value).format("ll");
  } else {
    return moment(value).format("ll");
  }
});

Vue.filter("bf22Discount", function (value) {
  if (!value) return "";
  if (value < 0) {
    return value;
  } else {
    return ((value / 100) * 90).toFixed(2);
  }
});

Vue.filter("bf23DiscountOriginalValue", function (value) {
  if (!value) return "";
  if (value < 0) {
    return value;
  } else {
    const discountPercentage = 0.1; // 10% discount in decimal form (0.10)

    // Calculate the original value
    const originalValue = value / (1 - discountPercentage);

    return originalValue.toFixed(2);
  }
});

Vue.filter("bf23DiscountMade", function (value) {
  if (!value) return "";
  if (value < 0) {
    return value;
  } else {
    const discountPercentage = 0.1; // 10% discount in decimal form (0.10)

    // Calculate the original value
    const originalValue = value / (1 - discountPercentage);

    return (originalValue - value).toFixed(2);
  }
});
Vue.filter("priceFormat", function (value) {
  if (!value) return "0.00";
  if (value < 0) {
    return value;
  } else {
    return parseFloat(value).toFixed(2);
  }
});
setTimeout(function () {
  AOS.init({ once: true });
}, 1500);
setTimeout(function () {
  AOS.init({ once: true });
}, 3000);
toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: false,
  progressBar: false,
  positionClass: "toast-top-right",
  //  preventDuplicates: true,
  onclick: null,
  showDuration: "300",
  hideDuration: "100",
  timeOut: "2000",
  extendedTimeOut: "100",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

$(document).ready(function (e) {
  var targetDate = new Date("Thr, 02 Jan 2025 08:00:00 GMT");
  var targetTime = targetDate.getTime(); // Get target time in milliseconds

  function updateTimer() {
    var currentDate = new Date();
    var currentTime = currentDate.getTime(); // Get current time in milliseconds
    var timeDiff = targetTime - currentTime;

    if (timeDiff <= 0) {
      // Timer expired, do something here
      clearInterval(timerInterval);
      $(".topbar-discount-heading").html("00:00:00:00");
    } else {
      var days = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
      var hours = Math.floor(
        (timeDiff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
      );
      var minutes = Math.floor((timeDiff % (60 * 60 * 1000)) / (60 * 1000));
      var seconds = Math.floor((timeDiff % (60 * 1000)) / 1000);

      // Format numbers with leading zeros
      days = formatWithLeadingZero(days);
      hours = formatWithLeadingZero(hours);
      minutes = formatWithLeadingZero(minutes);
      seconds = formatWithLeadingZero(seconds);

      $(".topbar-discount-heading").html(
        days + ":" + hours + ":" + minutes + ":" + seconds
      );
    }
  }

  // Helper function to add leading zeros
  function formatWithLeadingZero(number) {
    return number < 10 ? "0" + number : number;
  }

  // Set up the timer interval
  var timerInterval = setInterval(updateTimer, 1000);

  // Call updateTimer initially to set the initial display
  updateTimer();

  // Update the timer every second
  var timerInterval = setInterval(updateTimer, 1000);
});
