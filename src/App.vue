<template>
  <v-app v-loading="loading || lineLogin!==''">
<!-- <body>
  <main> -->
      <!-- Header -->
      <header id="js-header" class="u-header u-header--static u-shadow-v19">
        <!-- Top Bar -->
        <div class="u-header__section g-brd-bottom g-brd-gray-light-v4 g-transition-0_3">
          <div class="container">
            <div class="row justify-content-between align-items-center g-mx-0--lg">
              <!-- <div class="col-sm-auto g-hidden-sm-down"> -->
              <div>
                <!-- Social Icons -->
                <!-- <ul class="list-inline g-py-14 mb-0"> -->
                <ul class="list-inline mb-0">
                  <li class="list-inline-item">
                    <!-- <a class="g-color-black g-color-primary--hover g-pa-3" href="#"><i class="fa fa-facebook"></i></a> -->
                    <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="float-left"></v-app-bar-nav-icon>
                  </li>
                  <!-- <li class="list-inline-item">
                    <a class="g-color-black g-color-primary--hover g-pa-3" href="#"><i class="fa fa-twitter"></i></a>
                  </li>
                  <li class="list-inline-item">
                    <a class="g-color-black g-color-primary--hover g-pa-3" href="#"><i class="fa fa-tumblr"></i></a>
                  </li>
                  <li class="list-inline-item">
                    <a class="g-color-black g-color-primary--hover g-pa-3" href="#"><i class="fa fa-pinterest-p"></i></a>
                  </li>
                  <li class="list-inline-item">
                    <a class="g-color-black g-color-primary--hover g-pa-3" href="#"><i class="fa fa-google"></i></a>
                  </li> -->
                </ul>
                <!-- End Social Icons -->
              </div>

              <!-- <div class="col-sm-auto g-hidden-sm-down g-color-text g-font-weight-400 g-pl-15 g-pl-0--sm g-py-14">
                <i class="icon-communication-163 u-line-icon-pro g-font-size-18 g-valign-middle g-color-black g-mr-10 g-mt-minus-2"></i>
                <a v-if="auth.email==''" class="text-decoration-underline sample" @click="openModal" :disabled="loading">
                  電話番号ログイン
                </a>
              </div> -->

              <div class="g-color-white-opacity-0_6 g-font-weight-400 g-pl-15 g-pl-0--sm g-py-14">
                <v-btn
                  icon
                  color="green"
                  @click="refresh"
                >
                  <v-icon>mdi-cached</v-icon>
                </v-btn>
              </div>

              <!-- <div class="col-sm-auto g-pos-rel g-py-14"> -->
                <div class="g-pos-rel g-py-14">
                <!-- List -->
                <!-- <ul class="list-inline g-overflow-hidden g-pt-1 g-mx-minus-4 mb-0"> -->
                <ul class="list-inline g-pt-1 g-mx-minus-4 mb-0  mr-4">
                  <li v-if="auth.email!==''" class="list-inline-item g-mx-4">
                    <a v-if="auth.isNeedName" href="#" class="text-decoration-underline" :style="{'color':'red'}" @click="editAccount">名前を変更してください</a>
                    <a v-else href="#" @click="editAccount" class="text-decoration-underline">{{ auth.username }}</a><span v-if="!auth.isNeedName" class="sample pl-1 pt-1">さん</span>
                  </li>
                  <li v-else class="list-inline-item g-mx-4">
                    <!-- <a class="g-color-text g-color-primary--hover g-font-weight-400 g-text-underline--none--hover" href="#" @click="backHome">ログインしてください</a> -->

                    <!-- <P>FlamencoartsOkinawa</P> -->
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
        <!-- End Top Bar -->
      </header>
  
      <!-- Promo Slider -->
      <v-container>
        <router-view @drawerOpen="drawerOpen" />
      </v-container>

      <div class="g-bg-gray-light-v5">
        <div class="container">
          <div class="text-center mx-auto g-max-width-600 g-mt-30 g-mb-5">
            <h2 class="g-color-black mb-0">利用タイプ・料金</h2>
          </div>

          <!-- Carousel Slider -->
          <div id="carouselCus2" class="js-carousel g-pb-40 g-mx-minus-10"
               data-infinite="true"
               data-autoplay="false"
               data-slides-show="4"
               data-slides-scroll="1"
               data-center-mode="true"
               data-speed="8000"
              data-arrows-classes="u-arrow-v1 g-pos-abs g-bottom-0 g-width-45 g-height-45 g-color-gray-dark-v5 g-bg-secondary g-color-white--hover g-bg-primary--hover rounded"
              data-arrow-left-classes="fa fa-angle-left g-left-10"
              data-arrow-right-classes="fa fa-angle-right g-right-10"
              data-pagi-classes="u-carousel-indicators-v1 g-absolute-centered--x g-bottom-20 text-center"
               >
            <div class="js-slide g-px-10 g-py-20">
              <!-- Article -->
              <article class="media g-bg-white rounded g-pa-15">
                <!-- Article Image -->
                <div class="g-max-width-100 g-mr-15">
                  <!-- <img class="d-flex w-100" src="assets/img-temp/150x150/img1.jpg" alt="Image Description"> -->
                  <img class="d-flex w-100" src="/images/7.jpg" alt="Image Description">
                  <!-- <img class="d-flex w-100" src="http://www.fandangos-okinawa.com/wordpress/wp-content/uploads/2016/10/img_nag.jpg" alt="Image Description"> -->
                </div>
                <!-- End Article Image -->

                <!-- Article Info -->
                <div class="media-body align-self-center">
                  <h4 class="h5 g-mb-7">
                    <p class="g-color-black g-color-primary--hover g-text-underline--none--hover" href="#">個人練習</p>
                  </h4>
                  <p class="d-inline-block g-color-gray-dark-v5 g-font-size-13 g-mb-10" href="#">一人集中して練習する方。</p>
                  <!-- End Article Info -->

                  <!-- Article Footer -->
                  <footer class="d-flex justify-content-between g-font-size-12 flex-column bd-highlight text-right">
                    <!-- <span class="g-color-black g-line-height-1">1時間 ¥800</span>
                    <span class="g-color-black g-line-height-1">1.5時間 ¥1,200</span> -->
                    <div class="p-0 bd-highlight">1時間：¥800</div>
                    <div class="p-0 bd-highlight">1.5時間：¥1,200</div>
                    <div class="p-0 bd-highlight">2時間：¥1,600</div>
                    <!-- <ul class="list-inline g-color-gray-light-v2 g-font-size-14 g-line-height-1">
                      <li class="list-inline-item align-middle g-brd-right g-brd-gray-light-v3 g-pr-10 g-mr-6">
                        <a class="g-color-gray-dark-v5 g-color-primary--hover g-text-underline--none--hover" href="#" title="Add to Cart"
                           data-toggle="tooltip"
                           data-placement="top">
                          <i class="icon-finance-100 u-line-icon-pro"></i>
                        </a>
                      </li>
                      <li class="list-inline-item align-middle">
                        <a class="g-color-gray-dark-v5 g-color-primary--hover g-text-underline--none--hover" href="#" title="Add to Wishlist"
                           data-toggle="tooltip"
                           data-placement="top">
                          <i class="icon-medical-022 u-line-icon-pro"></i>
                        </a>
                      </li>
                    </ul> -->
                  </footer>
                  <!-- End Article Footer -->
                </div>
              </article>
              <!-- End Article -->
            </div>

            <div class="js-slide g-px-10 g-py-20">
              <!-- Article -->
              <article class="media g-bg-white rounded g-pa-15">
                <!-- Article Image -->
                <div class="g-max-width-100 g-mr-15">
                  <!-- <img class="d-flex w-100" src="assets/img-temp/150x150/img2.jpg" alt="Image Description"> -->
                  <img class="d-flex w-100" src="/images/1.jpg" alt="Image Description">
                  
                </div>
                <!-- End Article Image -->

                <!-- Article Info -->
                <div class="media-body align-self-center">
                  <h4 class="h5 g-mb-7">
                    <p class="g-color-black g-color-primary--hover g-text-underline--none--hover" href="#">グループ練習</p>
                  </h4>
                  <p class="d-inline-block g-color-gray-dark-v5 g-font-size-13 g-mb-10" href="#">発表会前の合同練習など。</p>
                  <!-- End Article Info -->

                  <!-- Article Footer -->
                  <!-- <footer class="d-flex justify-content-between g-font-size-16"> -->
                  <footer class="d-flex justify-content-between g-font-size-12 flex-column bd-highlight text-right">
                    <div class="p-0 bd-highlight">1時間：¥1,500</div>
                    <div class="p-0 bd-highlight">1.5時間：¥2,000</div>
                    <div class="p-0 bd-highlight">2時間：¥2,500</div>
                    <!-- <span class="g-color-black g-line-height-1">$55.00</span>
                    <ul class="list-inline g-color-gray-light-v2 g-font-size-14 g-line-height-1">
                      <li class="list-inline-item align-middle g-brd-right g-brd-gray-light-v3 g-pr-10 g-mr-6">
                        <a class="g-color-gray-dark-v5 g-color-primary--hover g-text-underline--none--hover" href="#" title="Add to Cart"
                           data-toggle="tooltip"
                           data-placement="top">
                          <i class="icon-finance-100 u-line-icon-pro"></i>
                        </a>
                      </li>
                      <li class="list-inline-item align-middle">
                        <a class="g-color-gray-dark-v5 g-color-primary--hover g-text-underline--none--hover" href="#" title="Add to Wishlist"
                           data-toggle="tooltip"
                           data-placement="top">
                          <i class="icon-medical-022 u-line-icon-pro"></i>
                        </a>
                      </li>
                    </ul> -->
                  </footer>
                  <!-- End Article Footer -->
                </div>
              </article>
              <!-- End Article -->
            </div>

            <div class="js-slide g-px-10 g-py-20">
              <!-- Article -->
              <article class="media g-bg-white rounded g-pa-15">
                <!-- Article Image -->
                <div class="g-max-width-100 g-mr-15">
                  <img class="d-flex w-100" src="/images/event-3.jpg" alt="Image Description">
                </div>
                <!-- End Article Image -->

                <!-- Article Info -->
                <div class="media-body align-self-center">
                  <h4 class="h5 g-mb-7">
                    <p class="g-color-black g-color-primary--hover g-text-underline--none--hover" href="#">その他利用：個人</p>
                  </h4>
                  <p class="d-inline-block g-color-gray-dark-v5 g-font-size-13 g-mb-10" href="#">フラメンコ練習以外、個人（お一人）でご利用の方。</p>
                  <!-- End Article Info -->

                  <!-- Article Footer -->
                  <!-- <footer class="d-flex justify-content-between g-font-size-16"> -->
                  <footer class="d-flex justify-content-between g-font-size-12 flex-column bd-highlight text-right">
                    <div class="p-0 bd-highlight">1時間：¥1,000</div>
                    <div class="p-0 bd-highlight">1.5時間：¥1,500</div>
                    <div class="p-0 bd-highlight">2時間：¥2,000</div>
                    <!-- <span class="g-color-black g-line-height-1">$55.00</span>
                    <ul class="list-inline g-color-gray-light-v2 g-font-size-14 g-line-height-1">
                      <li class="list-inline-item align-middle g-brd-right g-brd-gray-light-v3 g-pr-10 g-mr-6">
                        <a class="g-color-gray-dark-v5 g-color-primary--hover g-text-underline--none--hover" href="#" title="Add to Cart"
                           data-toggle="tooltip"
                           data-placement="top">
                          <i class="icon-finance-100 u-line-icon-pro"></i>
                        </a>
                      </li>
                      <li class="list-inline-item align-middle">
                        <a class="g-color-gray-dark-v5 g-color-primary--hover g-text-underline--none--hover" href="#" title="Add to Wishlist"
                           data-toggle="tooltip"
                           data-placement="top">
                          <i class="icon-medical-022 u-line-icon-pro"></i>
                        </a>
                      </li>
                    </ul> -->
                  </footer>
                  <!-- End Article Footer -->
                </div>
              </article>
              <!-- End Article -->
            </div>

            <div class="js-slide g-px-10 g-py-20">
              <!-- Article -->
              <article class="media g-bg-white rounded g-pa-15">
                <!-- Article Image -->
                <div class="g-max-width-100 g-mr-15">
                  <img class="d-flex w-100" src="/images/event-2.jpg" alt="Image Description">
                </div>
                <!-- End Article Image -->

                <!-- Article Info -->
                <div class="media-body align-self-center">
                  <h4 class="h5 g-mb-7">
                    <p class="g-color-black g-color-primary--hover g-text-underline--none--hover" href="#">その他利用：グループ</p>
                  </h4>
                  <p class="d-inline-block g-color-gray-dark-v5 g-font-size-13 g-mb-10" href="#">フラメンコ練習以外、グループ（複数人）でご利用の方。</p>
                  <!-- End Article Info -->

                  <!-- Article Footer -->
                  <!-- <footer class="d-flex justify-content-between g-font-size-16"> -->
                    <footer class="d-flex justify-content-between g-font-size-12 flex-column bd-highlight text-right">
                      <div class="p-0 bd-highlight">1時間：¥2,000</div>
                      <div class="p-0 bd-highlight">1.5時間：¥2,500</div>
                      <div class="p-0 bd-highlight">2時間：¥3,000</div>
                    <!-- <span class="g-color-black g-line-height-1">$55.00</span>
                    <ul class="list-inline g-color-gray-light-v2 g-font-size-14 g-line-height-1">
                      <li class="list-inline-item align-middle g-brd-right g-brd-gray-light-v3 g-pr-10 g-mr-6">
                        <a class="g-color-gray-dark-v5 g-color-primary--hover g-text-underline--none--hover" href="#" title="Add to Cart"
                           data-toggle="tooltip"
                           data-placement="top">
                          <i class="icon-finance-100 u-line-icon-pro"></i>
                        </a>
                      </li>
                      <li class="list-inline-item align-middle">
                        <a class="g-color-gray-dark-v5 g-color-primary--hover g-text-underline--none--hover" href="#" title="Add to Wishlist"
                           data-toggle="tooltip"
                           data-placement="top">
                          <i class="icon-medical-022 u-line-icon-pro"></i>
                        </a>
                      </li>
                    </ul> -->
                  </footer>
                  <!-- End Article Content -->
                </div>
              </article>
              <!-- End Article -->
            </div>

          </div>
        </div>
        <!-- End Carousel Slider -->
        </div>
      </div>

      <!-- Products -->
      <div class="container g-pb-100">
        <div class="text-center mx-auto g-max-width-600 g-mt-30 g-mb-50">
          <h2 class="g-color-black mb-4">スタジオ紹介</h2>
          <p class="lead">サクラの木を使用・・・</p>
        </div>

        <div id="carouselCus1" class="js-carousel g-pb-100"
             data-infinite="true"
             data-slides-show="4"
             data-arrows-classes="u-arrow-v1 g-pos-abs g-bottom-0 g-width-45 g-height-45 g-color-gray-dark-v5 g-bg-secondary g-color-white--hover g-bg-primary--hover rounded"
             data-arrow-left-classes="fa fa-angle-left g-left-10"
             data-arrow-right-classes="fa fa-angle-right g-right-10"
             data-pagi-classes="u-carousel-indicators-v1 g-absolute-centered--x g-bottom-20 text-center">
          <div class="js-slide">
            <div class="g-px-10">
              <!-- Product -->
              <figure class="g-pos-rel g-mb-20">
                <v-list-item-avatar
                  class="p-0 mr-3"
                  tile
                  size="150"
                  color="grey"
                >
                <img class="img-fluid" src="assets/img-temp/480x700/img1.jpg" alt="Image Description">
                  <!-- <img class="img-fluid" src="https://www.fandangos-okinawa.com/wordpress/wp-content/uploads/2016/10/img_nag.jpg" alt="名護スタジオ"> -->
                </v-list-item-avatar>
                <!-- <figcaption class="w-100 g-bg-primary g-bg-black--hover text-center g-pos-abs g-bottom-0 g-transition-0_2 g-py-5">
                  <a class="g-color-white g-font-size-11 text-uppercase g-letter-spacing-1 g-text-underline--none--hover" href="#">名護スタジオ</a>
                </figcaption> -->
              </figure>

              <div class="media">
                <!-- Product Info -->
                <div class="d-flex flex-column">
                  <h4 class="h6 g-color-black mb-1">
                    <a class="u-link-v5 g-color-black g-color-primary--hover" href="#">
                      名護スタジオ
                    </a>
                  </h4>
                  <a class="d-inline-block g-color-gray-dark-v5 g-font-size-13" href="#">明るくて爽やかな室内、緑に囲まれて癒やされます。</a>
                  <!-- <span class="d-block g-color-black g-font-size-17">$52.00</span> -->
                </div>
                <!-- End Product Info -->

                <!-- Products Icons -->
                <!-- <ul class="list-inline media-body text-right">
                  <li class="list-inline-item align-middle mx-0">
                    <a class="u-icon-v1 u-icon-size--sm g-color-gray-dark-v5 g-color-primary--hover g-font-size-15 rounded-circle" href="#"
                       data-toggle="tooltip"
                       data-placement="top"
                       title="Add to Cart">
                      <i class="icon-finance-100 u-line-icon-pro"></i>
                    </a>
                  </li>
                  <li class="list-inline-item align-middle mx-0">
                    <a class="u-icon-v1 u-icon-size--sm g-color-gray-dark-v5 g-color-primary--hover g-font-size-15 rounded-circle" href="#"
                       data-toggle="tooltip"
                       data-placement="top"
                       title="Add to Wishlist">
                      <i class="icon-medical-022 u-line-icon-pro"></i>
                    </a>
                  </li>
                </ul> -->
                <!-- End Products Icons -->
              </div>
              <!-- End Product -->
            </div>
          </div>

          <div class="js-slide">
            <div class="g-px-10">
              <!-- Product -->
              <figure class="g-pos-rel g-mb-20">
                
                <v-list-item-avatar
                  class="p-0 mr-3"
                  tile
                  size="150"
                  color="grey"
                >
                  <img class="img-fluid" src="assets/img-temp/480x700/img2.jpg" alt="Image Description">
                  <!-- <img class="img-fluid" src="https://www.fandangos-okinawa.com/wordpress/wp-content/uploads/2016/10/img_cdd.jpg" alt="コザスタジオ"> -->
                </v-list-item-avatar>
                <!-- <span class="u-ribbon-v1 g-width-40 g-height-40 g-color-white g-bg-primary g-font-size-13 text-center text-uppercase g-rounded-50x g-top-10 g-right-minus-10 g-px-2 g-py-10">-40%</span> -->
              </figure>

              <div class="media">
                <!-- Product Info -->
                <div class="d-flex flex-column">
                  <h4 class="h6 g-color-black mb-1">
                    <a class="u-link-v5 g-color-black g-color-primary--hover" href="#">
                      コザスタジオ
                    </a>
                  </h4>
                  <a class="d-inline-block g-color-gray-dark-v5 g-font-size-13" href="#">クジラの壁画が特徴的、アートな雰囲気です。</a>
                  <!-- <span class="d-block g-color-black g-font-size-17">$99.00</span> -->
                </div>
                <!-- End Product Info -->

                <!-- Products Icons -->
                <!-- <ul class="list-inline media-body text-right">
                  <li class="list-inline-item align-middle mx-0">
                    <a class="u-icon-v1 u-icon-size--sm g-color-gray-dark-v5 g-color-primary--hover g-font-size-15 rounded-circle" href="#"
                       data-toggle="tooltip"
                       data-placement="top"
                       title="Add to Cart">
                      <i class="icon-finance-100 u-line-icon-pro"></i>
                    </a>
                  </li>
                  <li class="list-inline-item align-middle mx-0">
                    <a class="u-icon-v1 u-icon-size--sm g-color-gray-dark-v5 g-color-primary--hover g-font-size-15 rounded-circle" href="#"
                       data-toggle="tooltip"
                       data-placement="top"
                       title="Add to Wishlist">
                      <i class="icon-medical-022 u-line-icon-pro"></i>
                    </a>
                  </li>
                </ul> -->
                <!-- End Products Icons -->
              </div>
              <!-- End Product -->
            </div>
          </div>
        </div>
      </div>
      <!-- End Products -->

       <!-- Footer -->
      <footer class="g-bg-main-light-v1">
        <!-- Copyright -->
        <div class="container g-pt-30 g-pb-10">
          <div class="row justify-content-between align-items-center">
            <div class="col-md-6 g-mb-20">
              <!-- <p class="g-font-size-13 mb-0">2020 &copy; Htmlstream. All Rights Reserved.</p> -->
              <p class="g-font-size-13 mb-0">2021 &copy; Flamencoarts Okinawa.</p>
            </div>

            <div class="col-md-6 text-md-right g-mb-20">
              <ul class="list-inline g-color-gray-dark-v5 g-font-size-25 mb-0">
                <li class="list-inline-item g-cursor-pointer mr-1">
                  <i class="fa fa-cc-visa" title="Visa"
                     data-toggle="tooltip"
                     data-placement="top"></i>
                </li>
                <li class="list-inline-item g-cursor-pointer mx-1">
                  <i class="fa fa-cc-mastercard" title="Master Card"
                     data-toggle="tooltip"
                     data-placement="top"></i>
                </li>
                <li class="list-inline-item g-cursor-pointer ml-1">
                  <i class="fa fa-cc-discover" title="Discover"
                     data-toggle="tooltip"
                     data-placement="top"></i>
                </li>
                <li class="list-inline-item g-cursor-pointer ml-1">
                  <i class="fa fa-cc-jcb" title="JCB"
                     data-toggle="tooltip"
                     data-placement="top"></i>
                </li>
                <li class="list-inline-item g-cursor-pointer ml-1">
                  <i class="fa fa-cc-stripe" title="Stripe"
                     data-toggle="tooltip"
                     data-placement="top"></i>
                </li>
              </ul>
            </div>

          </div>
        </div>
        <!-- End Copyright -->
      </footer>
      <!-- End Footer -->

      <a class="js-go-to u-go-to-v2" href="#"
         data-type="fixed"
         data-position='{
           "bottom": 15,
           "right": 15
         }'
         data-offset-top="400"
         data-compensation="#js-header"
         data-show-effect="zoomIn">
        <i class="hs-icon hs-icon-arrow-top"></i>
      </a>

      <modal-edit-account 
        ref="dialogEditAccount"
        :dialog-form-visible="modal_editaccount_visible" 
        :close-modal="close_modal"
        @reload="reload"
       />

    <v-navigation-drawer
      v-model="drawer"
      :style="{'z-index':1000, 'height': height+adjust+'px'}"
      absolute
      temporary
    >
      <v-card
        outlined
        v-scroll.self="onScroll"
        class="overflow-y-auto"
        :max-height="height"
      >
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-center">
              <h4 class="h4 pt-5">スタジオ予約</h4>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

        <div v-if="auth.email!==''">
          <div class="text-center">
            <div class="mb-0">
              <h5 class="pt-2 g-text-underline text-primary" @click="myReserve">あなたの情報</h5>
            </a>
            </div>
            <div class="mb-4">
              ポイント：<span class="g-color-primary g-font-weight-300 g-font-size-20 mr-2">{{ auth.credit.toLocaleString() }}</span>
            </div>
          </div>
          <v-divider></v-divider>
          <div class="pl-4 pr-4">
            <div class="text-center">
              <h5 class="pt-2 pb-2">空き時間検索</h5>
            </div>
            <search-studio 
              ref="searchStudio"
              @searchStudio="searchStudio"
              @cancel="cancel"
             />
          </div>
        </div>
        <div v-else class="p-2">
          <el-alert
            class="text-left mb-5"
            type="warning"
            description="ログインしてください"
            show-icon>
          </el-alert>
        </div>

        <v-list class="p-2 pb-5" dense>
          <v-list-item>
            <v-list-item-title v-if="auth.email!==''" @click="logout">ログアウト</v-list-item-title>
          </v-list-item>
        </v-list>
    </v-card>
  </v-navigation-drawer>

</v-app>

</template>
<style>
  .js-scrollable {
    width: 100%;
    overflow-x: scroll;
    width: 500px;
  }
  table {
    width: 800px;
  }
  th {
    font-size: 16px;
    font-weight: bold;
    padding: 20px;
  }
  td {
    font-size: 14px;
    padding: 20px;
    line-height: 1.4;
  }
</style>

<script>
  import store from './store/app';
  import axios from "axios"
  import { mdiAccount, mdiKey, mdiCartVariant, mdiCardAccountDetailsOutline } from '@mdi/js'
  import moment from 'moment-timezone'
  import Firebase from "Firebase";
  import firebase from "@firebase/app";
  import SearchStudio from './components/SearchStudio';
  import ModalEditAccount from './components/ModalEditAccount'
  // import { loadStripe } from '@stripe/stripe-js';
  // const stripePromise = loadStripe('pk_test_51I1LTfAXJN6gcxR4I1pw3tPbCXFUl8rnbbq0Wcl6dJhQkjb3ZuuASp8GlpCVTZLFfMn4TnWdkZm1nS52N99w5ch400f3oMXvxy');

export default {
  name: 'App',
  components: {
    SearchStudio,
    ModalEditAccount,
    // ModalShop,
    // VCard,
    // VCardText,
    // VCardMedia
  },
  data() {
    return {
      modal_editaccount_visible: false,
      drawer: false,
      scrollInvoked: 0,
      // isSearch: false,
      // sheet: false,
      // drawer: false,
      // activeIndex: 'Home',
      // tabs: null,
      // text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      // modal_login_visible: false,
      // mdiAccount,
      // mdiCartVariant,
      // mdiCardAccountDetailsOutline,
      // items: [
      //   {
      //     title: 'ログアウト',
      //   }
      // ],
      // fab: false,
      // // modal_visible: false,
      // modal_shop_visible: false
    }
  },
  computed: {
    // items () {
    //   return Array.from({ length: this.length }, (k, v) => v + 1)
    // },
    // length () {
    //   return 7000
    // },
    adjust () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 220
        case 'sm': return 400
        case 'md': return 500
        case 'lg': return 600
        case 'xl': return 800
      }
    },
    height() {
      // return window.innerHeight;
      return window.innerHeight;
    },
    loading() {
      return store.state.isLoading;
    },
    auth() {
      return store.state.auth;
    },
    info() {
      return store.state.info;
    },
    lineLogin() {
      return store.state.lineLogin;
    },
    supersass() {
      return store.state.auth.supersass;
    },
    search() {
      return store.state.search;
    },
    isSearch() {
      return store.state.isSearch;
    },
  },
  watch: {
  },
  // beforeRouteUpdate (to, from, next) { // eslint-disable-line
  //     console.log('beforeRouteEnter /App');
  //     next();
  // },
  // beforeRouteEnter (to, from, next) {
  //   //ページの更新
  //   console.log('beforeRouteEnter /App');
  // },
  mounted() {

    store.commit('SET_ISLOADING', true);

    // // 検証用
    // store.commit('SET_BACK_URI', '');
    // store.commit('SET_LINE_LOGIN', '');

    let that = this;
    console.log('mute a', store.state.backuri, this.lineLogin); 
    if(store.state.backuri=='/?mode=stripeCancel') {
      that.$nextTick(function () {
        store.commit('SET_ISLOADING', true);
        that.$message({
          type: 'error',
          message: 'カード決済をキャンセルしました。',
        });
        store.commit('SET_BACK_URI', '');
        setTimeout(function(){
          that.$router.push({path: '/schedule'});
        }, 500);
      });
      return;
    }else if(store.state.backuri=='/?mode=stripeSuccess') {
      that.$nextTick(function () {
        // store.commit('SET_ISLOADING', true);
        store.commit('SET_BACK_URI', '');
      });
      return;
    }

    // ログインユーザー取得
    // let currentUserStatus = Firebase.auth().currentUser;
    // console.log('user', currentUserStatus);
    // console.log('user', store.state.auth);

    // LINEアカウント情報ありの場合
    if(store.state.backuri=='/line' && this.lineLogin!=='' && that.auth.email==''){
      // LINEアカウント取得
      that.$nextTick(function () {
        store.commit('SET_ISLOADING', true);
        that.loginUser();
      });
      return;
    }

    // ログイン確認
    if(store.state.auth.email!=='') {
      console.log('login');
      // ログイン済
      that.$nextTick(function () {
        store.commit('SET_ISLOADING', true);
        store.commit('SET_BACK_URI', '/schedule');
        that.$router.push({path: '/schedule'});
      });
    }else{
      console.log('none login', store.state.backuri);
      // ログイン未だ
      that.$nextTick(function () {
        store.commit('SET_BACK_URI', '/back');
        if(that.$route.path!=='/' && that.$route.path!=='') {
          that.$router.push({path: '/'});
          store.commit('SET_ISLOADING', false);
          return;
        }
        store.commit('SET_ISLOADING', false);
      });
    }

    // if(store.state.backuri=='/line'){
    //   console.log('abo', that.$route.path);
    //   that.$nextTick(function () {
    //     that.$router.push({path: '/schedule'});
    //   });
    // }

    // setTimeout(function(){
    //   store.commit('SET_ISLOADING', false);
    // },2000);

  },
  created: function () {
    var userAgent = window.navigator.userAgent.toLowerCase();
    let browser='';
    if(userAgent.indexOf('msie') != -1 ||
        userAgent.indexOf('trident') != -1) {
        browser='IE';
    } else if(userAgent.indexOf('edge') != -1) {
        browser='edge';
    } else if(userAgent.indexOf('chrome') != -1) {
        browser='chrome';
    } else if(userAgent.indexOf('safari') != -1) {
        browser='safari';
    } else if(userAgent.indexOf('firefox') != -1) {
        browser='firefox';
    } else if(userAgent.indexOf('opera') != -1) {
        browser='opera';
    } else {
        // console.log('そんなブラウザは知らん');
    }
    store.commit('SET_INFO_BROUSER', browser);

    // 今日の日付取得
    store.commit('SET_SELECT_DATE', this.$moment().format('YYYY-MM-DD'))

    // console.log("browser",browser);
    this.reload();   
  },
  methods: {
    onScroll () {
      this.scrollInvoked++
    },
    loginUser() {
      const code = this.lineLogin.code;
      const state = this.lineLogin.state;
      var that = this;
      try {
        const url = this.supersass.baseHost+"/?mode=successLineLogin";
        store.dispatch('getLineUserInfo', {
          params: {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: url,
            client_id: '1655706276',
            client_secret: '7dfe0e67718d9989ba4024a9d1a15eea',
          },
          callback: function(res) {
            if(!res) {
              console.log(res);
              alert('エラー111。恐れ入りますが、管理者までご連絡をお願いいたしますm(__)m');
              return;
            }

            // LINEアカウント取得
            console.log('email??', res.email);
            // if(res.email==undefined || res.email==null){
            if(!res.email){
              that.$message({
                type: 'error',
                message: 'LINEのメールアドレス取得に失敗しました！',
              });
              setTimeout(function(){
                store.commit('SET_ISLOADING', false);
              },1000);
            }else{
              // ログインする
              Firebase.signInWithEmailAndPassword(res.email, res.email);
              that.reload();
              setTimeout(function(){
                that.$message({
                  type: 'success',
                  message: 'LINEログイン成功しました！',
                });
                // store.commit('SET_BACK_URI', '/schedule');
                // that.$router.push({path: '/schedule'});
                store.commit('SET_ISLOADING', false);
              },1000);
            }
            store.commit('SET_LINE_LOGIN', '');
          }
        });
       } catch(error){
        console.log(error)
      }
    },
    searchStudio() {
      // const isValid = await this.$refs.observer.validate();
      // if (!isValid) {
      //   // ABORT!!
      //   return;
      // }
      
      // 利用可能時間を検索する
      var that = this;
      that.form = this.search;

      // 時間変換
      switch (that.form.time_zone_name) {
        case '1時間':
          that.form.time_zone='1:00'
          that.form.hour=1
          break;
        case '1.5時間':
          that.form.time_zone='1:30'
          that.form.hour=1.5
          break;
        case '2時間':
          that.form.time_zone='2:00'
          that.form.hour=2
          break;
      }

      // 一般価格
      let _documentName = "個人利用";
      if(that.form.use_type == "グループ") _documentName = "団体利用";
      // let _documentName = "スタジオレンタル（個人利用）";
      // if(that.form.use_type == "グループ") _documentName = "スタジオレンタル（団体利用）";

      // フラメンコ練習
      let is_framenco = true;
      if(that.form.use_name !== "フラメンコ練習") is_framenco = false;
      that.form.is_framenco = is_framenco;

      // 会員の場合且つフラメンコれんしゅうのみ
      // if(that.auth.isLine && is_framenco) {
      if(is_framenco) {
        _documentName = "スタジオレンタル（個人利用）";
        if(that.form.use_type == "グループ") _documentName = "スタジオレンタル（団体利用）";
      }
      that.form.document = _documentName;
      
      // スタジオコード取得
      that.form.resource_id = 794201;
      if(that.form.studio_name == "ナゴスタジオ") that.form.resource_id = 794202;

      // 料金取得
      let price = 0;
      Firebase.db().collection("schedules").doc(_documentName)
      .get().then(function(querySnapshot) {
        if (querySnapshot.exists) {

          let resource = querySnapshot.data()
          that.form.price = resource.resources[that.form.time_zone].price;
          // console.log('free doc', that.form.price);

          // 決済以外（ポイント精算）
          let credit = store.state.auth.credit;
          if(credit<=that.form.price) that.form.is_stripe = true;
          store.commit('SET_SELECT_SEARCH', that.form);

          // 利用可能時間を取得
          store.dispatch('getFree', {
            params: that.form,
            callback: function(res) {
              store.commit('SET_SELECT_RESOURCES', res);
              // that.isSearch = true;
              console.log(that.$route.path);
              if(that.$route.path!=='/schedule') that.$router.push({path: '/schedule'});
              store.commit('SET_ISLOADING', false);
              // 検索閉じる
              that.drawer = false;
            }
          });

        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
     
    },
    onScroll(e){
      if (typeof window === 'undefined') return
      const top = window.pageYOffset ||   e.target.scrollTop || 0
      // console.log(top)
      this.fab = top > 50
    },
    toTop() {
      this.$vuetify.goTo("#app")
    },
    close_login_modal: function() {
      this.modal_login_visible = false;
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
      // this.activeIndex = this.$route.name;
      this.activeIndex = key;
    },
    logout: function () {
      if(this.auth.email=="") return;
      store.commit('SET_ISLOADING', true);

      // ログアウト処理
      Firebase.logOut();

      var that = this;
      setTimeout(function(){
        that.$message({
          message: 'ログアウトしました！',
          type: 'success'
        });
        store.commit('SET_ISLOADING', false);
      },700);
        
    },
    // login: function () {
    //   if(this.$route.path=='/login') return;
    //   this.$router.replace('/login')
    // },
    schedule: function () {
      if(this.$route.path=='/') return;
      this.$router.replace('/')
    },
    openModal(){
     // ログインチェック
     var that = this;
     let currentUserStatus = Firebase.auth().currentUser;
     if(currentUserStatus==null) {
       // ログイン未だの場合
       that.$router.push({path: '/login'});
       return;
     }
    },
    // openShop() {
    //   // チケット購入
    //   // this.modal_shop_visible = true;
    //   store.commit('SET_ISLOADING', true)
      
    //   let that = this;
    //   let parms = {
    //     price: 4000,
    //     email: that.auth.email
    //   }
    //   const processA = async function() {
    //     const stripe = await stripePromise;
    //     const response = await firebase.functions().httpsCallable('postStripe');
    //     await response({
    //       // path: '/create-checkout-session-ticket',
    //       method: 'POST',
    //       params: {
    //         price: "price_1IJdUsAXJN6gcxR4UbytacgS",
    //         quantity: 1,
    //       },
    //       mode: "payment",
    //       // success_url: "https://localhost:4006/?mode=stripeSuccessPoint",
    //       success_url: "https://vue-authentification-b7a7a.firebaseapp.com/?mode=stripeSuccessPoint",
    //       cancel_url: "https://www.fandangos-okinawa.com/reservation/?mode=stripeCancel",
    //       headers: {
    //         "Accept": "*/*",
    //         "Contsent-Type": "application/json; charset=utf-8",
    //         "Access-Control-Allow-Origin": "*",
    //       }
    //     }).then((res) => {
    //       console.log(res)
    //       const session = res.data;
    //       const sessionId = session.id;

    //       // 一旦保持
    //       Firebase.db().collection("sessions").doc(parms.email)
    //       .set({
    //         sessionId: sessionId,
    //         params: parms,
    //         status: 'checkout'
    //       });

    //       const result = stripe.redirectToCheckout({
    //         sessionId: sessionId,
    //       });
    //       if (result.error) {
    //         console.log(result.error.message);
    //       }
     
    //     });
    //   }
    //   const processAll = async function() {
    //     await processA()
    //   }
    //   processAll()
    // },
    openMaster() {
      this.$router.push({path: '/admin'});
    },
    editAccount() {
      // store.commit('SET_ISLOADING', true);
      this.modal_editaccount_visible = true;
    },
    close_modal: function() {
      console.log('close', store.state.backuri, this.$route.path);
      this.modal_editaccount_visible = false;
      this.reload();
      // this.$router.replace('/schedule');
    },
    cancel() {
      this.drawer = false;
      store.commit('SET_SELECT_RESOURCES', []);
      store.commit('SET_IS_SEARCH', false);
      store.commit('SET_ISLOADING', false);
    },
    reload() {
      store.commit('SET_ISLOADING', true);
      let that = this;
      const processA = async function() {
        await store.commit('SET_ISLOADING', true);
        await store.dispatch('getUsers',function(e){
          let currentUserStatus = Firebase.auth().currentUser;
          if(!currentUserStatus) console.log('no singin');
          else store.commit('SET_AUTH', currentUserStatus)
        });
        await store.commit('SET_EVENTS', []);
        // 予約取得
        await store.dispatch('getBookings',{
          callback: function(res){
            if(res) store.commit('SET_ISLOADING', false)
          }
        });
        // // クラス取得
        // await store.dispatch('getClass',{})
        //  // 自身の予約
        // await store.dispatch('getUserAgenda',{
        //   params: {
        //     from_date: moment('2021-03-10').format('YYYY-MM-DD HH:mm:ss'),
        //     user_email: that.auth.email
        //   },
        // });
      }
      const processAll = async function() {
        await processA()
        // if(that.$route.path!=='/') that.$router.push({path: '/'});
      }
      processAll();
    },
    refresh() {
      this.reload();
      let backuri=store.state.backuri;
      store.commit('SET_BACK_URI', '');
      store.commit('SET_LINE_LOGIN', '');
      setTimeout(function(){
        store.commit('SET_ISLOADING', false);
        if(backuri=="") window.location.reload();
      },300);
    },
    myReserve() {
      console.log(this.$route.path);
      // LINEログイン後、パス指定されている場合
      let that = this;
      if(this.$route.path=='/schedule'){
        // 初期化後に、再パス指定
        setTimeout(function(){
          that.$router.push({path: '/about'});
        },400);
        return;
      }
      if(this.$route.path=='/about') return;
      // 通常パス指定
      this.$router.push({path: '/about'});
    },
    backHome() {
      setTimeout(function(){
        store.commit('SET_BACK_URI', '');
        store.commit('SET_LINE_LOGIN', '');
        store.commit('SET_ISLOADING', false);
      },500);
      if(this.$route.path=='/') return;

      let that = this;
      if(that.auth.email!=='' && this.$route.path!=='/schedule') {
        that.$router.replace('/schedule');
        return;
      }
      that.$router.replace('/');

    },
    goSchedule() {
      if(this.$route.path=='/schedule') return;
      this.$router.push({path: '/schedule'});
    },
    drawerOpen() {
      this.drawer=true;
    }
  }
};
</script>
