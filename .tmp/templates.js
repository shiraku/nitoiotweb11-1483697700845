angular.module('nitoiotweb11App').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/device/deviceList.html',
    "<div ng-controller=DeviceListCtrl ng-cloak=\"\" class=navBardemoBasicUsage><!--ヘッダー読み込み--><navitop></navitop><div class=\"md-toolbar-tools searchbox\"><md-input-container><input ng-model=query><md-icon><svg width=24px height=24px viewbox=\"296 5 24 24\" version=1.1 xmlns=http://www.w3.org/2000/svg xmlns:xlink=http://www.w3.org/1999/xlink><g id=Material/Icons-white/search stroke=none fill=none transform=\"translate(296.000000, 5.000000)\" fill-rule=evenodd><path d=\"M15.502,9.491 L14.708,9.491 L14.432,9.765 C15.407,10.902 16,12.376 16,13.991 C16,17.581 13.09,20.491 9.5,20.491 C5.91,20.491 3,17.581 3,13.991 C3,10.401 5.91,7.491 9.5,7.491 C11.115,7.491 12.588,8.083 13.725,9.057 L14.001,8.783 L14.001,7.991 L18.999,3 L20.49,4.491 L15.502,9.491 L15.502,9.491 Z M9.5,9.491 C7.014,9.491 5,11.505 5,13.991 C5,16.476 7.014,18.491 9.5,18.491 C11.985,18.491 14,16.476 14,13.991 C14,11.505 11.985,9.491 9.5,9.491 L9.5,9.491 Z\" id=Shape fill=#FFFFFF transform=\"translate(11.745000, 11.745500) scale(1, -1) translate(-11.745000, -11.745500) \"></path></g></svg></md-icon></md-input-container></div><div ng-cloak><md-tabs md-dynamic-height md-border-bottom><md-tab label=一覧><!--デバイス一覧--><ul><li ng-repeat=\"item in deviceList | filter:query\" on-finish-render=deviceInfoFinished><md-card><md-list-item class=md-list-item-2 ng-click=deviceDetail()><p class=md-body-5>{{::item.deviceName}}</p><buttondetail></buttondetail></md-list-item><md-card-content><!--職場責任者・連絡先--><div class=md-contentPaddingBottom><div class=md-body-1>職場責任者：{{::item.responsiblePerson}}</div><div class=md-body-1>連絡先：{{::item.telNo}}</div><div class=md-body-1 ng-if=\"item.status=='感知あり'\">発生日時：{{item.date}}</div></div><!--感知あり/なし--><div layout=row layout-wrap class=md-card-blank-top><span class=md-body-3>{{::item.status}}</span></div><!--地震の場合--><div layout=row class=md-contentPaddingBottom layout-wrap ng-if=\"item.type == 'EQ'\"><div flex=25><p flex class=md-body-1>傾き</p><p flex class=md-body-1>商用停電</p><p flex class=md-body-1>機器異常</p></div><div flex=40><p flex class=md-body-3 ng-if=item.slope>あり（{{::item.slope}}）</p><p flex class=md-body-3 ng-if=\"item.slope == 0\">なし</p><p flex class=md-body-3 ng-if=item.commercialBlackout>あり</p><p flex class=md-body-3 ng-if=!item.commercialBlackout>なし</p><p flex class=md-body-3 ng-if=item.equipmentAbnormality>あり</p><p flex class=md-body-3 ng-if=!item.equipmentAbnormality>なし</p></div><div><div flex class=md-body-1>震度</div><div flex class=md-body-6>{{item.seismicIntensity}}</div></div></div><!--雷の場合--><div layout=row class=md-contentPaddingBottom layout-wrap ng-if=\"item.type == 'FL'\"><div flex=25><p flex class=md-body-1>漏電</p><p flex class=md-body-1>商用停電</p><p flex class=md-body-1>機器異常</p></div><div flex=40><p flex class=md-body-3 ng-if=item.leakage>あり</p><p flex class=md-body-3 ng-if=!item.leakage>なし</p><p flex class=md-body-3 ng-if=item.commercialBlackout>あり</p><p flex class=md-body-3 ng-if=!item.commercialBlackout>なし</p><p flex class=md-body-3 ng-if=item.equipmentAbnormality>あり</p><p flex class=md-body-3 ng-if=!item.equipmentAbnormality>なし</p></div><div><div flex class=md-body-1>雷</div><div flex class=md-body-6>{{item.power}}</div></div></div><p class=md-body-1 ng-if=\"item.commentList != undefined\">コメント・連絡事項</p><ul ng-if=\"item.commentList != undefined\"><li ng-repeat=\"cl in item.commentList\"><p class=md-body-2 ng-if=!cl.importantFlg>{{::cl.comment}}　{{::cl.timestamp}}</p><p class=\"md-body-2 importantFlg\" ng-if=cl.importantFlg>{{::cl.comment}}　{{::cl.timestamp}}</p></li></ul></md-card-content><!--環境センサー--><md-card-content layout-wrap ng-if=\"env && item.envSensorFlg\"><div class=md-body-1>これからの天気</div><div layout=row ng-click=\"envLogData('temp')\"><div flex=25><dl class=text-center><dt class=md-body-1>現在</dt><dd class=nito-env-img><img src=/assets/images/icon_sunny.svg></dd><dd class=\"md-headline nito-env-temp\">{{::env.temperature}}<span class=\"md-subhead env-temp\">℃</span></dd><dd class=\"md-subhead md-main-text\">{{::env.humidity}}<span class=md-body-1>%</span></dd></dl></div><div flex=25><dl class=text-center><dt class=md-body-1>13時</dt><dd class=nito-env-img><img src=/assets/images/icon_cloud.svg></dd><dd class=\"md-headline nito-env-temp\">32<span class=md-subhead>℃</span></dd><dd class=\"md-subhead md-main-text\">50<span class=md-body-1>%</span></dd></dl></div><div flex=25><dl class=text-center><dt class=md-body-1>14時</dt><dd class=nito-env-img><img src=/assets/images/icon_rainy.svg></dd><dd class=\"md-headline nito-env-temp\">32<span class=md-subhead>℃</span></dd><dd class=\"md-subhead md-main-text\">50<span class=md-body-1>%</span></dd></dl></div><div flex=25><dl class=text-center><dt class=md-body-1>15時</dt><dd class=nito-env-img><img src=/assets/images/icon_sunny_cloudy.svg></dd><dd class=\"md-headline nito-env-temp\">32<span class=md-subhead>℃</span></dd><dd class=\"md-subhead md-main-text\">50<span class=md-body-1>%</span></dd></dl></div></div><div class=md-body-1>直近の気温・湿度・気圧の推移</div></md-card-content><md-card-content class=nito-env-data layout-wrap ng-if=\"env && item.envSensorFlg\"><div layout=row><div flex=25 class=\"nito-env-datas nito-env-ap\" ng-click=\"envLogData('pressure')\"><dl class=text-center><dt class=md-body-1>気圧</dt><dd class=md-body-2>{{::env.pressure}} <span class=md-body-1>hpa</span></dd></dl></div><div flex=25 class=\"nito-env-datas nito-env-uv\" ng-click=\"envLogData('uvi')\"><dl class=text-center><dt class=md-body-1>紫外線</dt><dd class=md-body-2>{{::env.uvi}}</dd></dl></div><div flex=25 class=\"nito-env-datas nito-env-di\" ng-click=\"envLogData('discomfortIndex')\"><dl class=text-center><dt class=md-body-1>不快指数</dt><dd class=md-body-2>{{::env.discomfortIndex}}</dd></dl></div><div flex=25 class=\"nito-env-datas nito-env-hi\" ng-click=\"envLogData('heatstroke')\"><dl class=text-center><dt class=md-body-1>熱中症指数</dt><dd class=md-body-2>{{::env.heatstroke}}</dd></dl></div></div></md-card-content><md-card-content ng-if=\"env && item.envSensorFlg\"><p class=md-body-1>環境汚染</p><md-list-item ng-click=\"envLogData('noise')\"><p class=md-body-2>騒音</p><span class=md-body-1>{{::env.noise}} dB</span><buttondetail></buttondetail></md-list-item><md-list-item ng-click=\"envLogData('pm25')\"><p class=md-body-2>PM2.5</p><span class=md-body-1>少ない</span><buttondetail></buttondetail></md-list-item><md-list-item ng-click=\"envLogData('pm10')\"><p class=md-body-2>花粉</p><span class=md-body-1>多い</span><buttondetail></buttondetail></md-list-item></md-card-content></md-card></li></ul></md-tab><!--グラフタブ---------------><md-tab label=グラフ><md-input-container class=md-block flex-gt-sm><label>グラフの表示期間を選択</label><md-select ng-change=changeItem ng-model=selectItem><md-option ng-repeat=\"item in selectItems\" value={{item.value}}>{{::item.label}}</md-option></md-select></md-input-container><ul><li ng-repeat=\"item in deviceList | filter:query\" on-finish-render=deviceListFinished><md-card><md-list-item class=md-list-item-2 ng-click=deviceDetail()><p class=md-body-5>{{::item.deviceName}}</p><buttondetail></buttondetail></md-list-item><!--デバイスカード　コンテンツ--><md-card-content><!--地震データ有りの場合 グラフを表示する--><div google-chart chart=charts id={{::item.deviceId}} class=google-chart><p flex class=md-body-1>地震データなし</p></div></md-card-content></md-card></li></ul></md-tab><!--マップタブ---------------><md-tab label=マップ><!--MAP--><div class=map><!-- <ui-gmap-google-map center=\"map.center\" zoom=\"map.zoom\" draggable=\"true\" bounds=\"map.bounds\">\n" +
    "                <ui-gmap-google-map zoom=\"map.zoom\" draggable=\"true\" bounds=\"map.bounds\">  --><!-- <ui-gmap-markers models=\"markers\" coords=\"'self'\" icon=\"'icon'\"></ui-gmap-markers>\n" +
    "              </ui-gmap-google-map> --><div id=map-deviceList></div></div></md-tab></md-tabs></div><!-- </script> --></div><!-- Modal for inProgress --><script type=text/ng-template id=T_inProgress><!-- <div class=\"modal-body\"> -->\n" +
    "  <md-progress-circular md-mode=\"indeterminate\"></md-progress-circular>\n" +
    "  <!-- </div> --></script><!-- Modal for inProgress--><footer class=footer></footer>"
  );


  $templateCache.put('app/deviceGroup/deviceGroup.html',
    "<div ng-controller=DeviceGroupCtrl ng-cloak=\"\" class=navBardemoBasicUsage><!--ヘッダー読み込み--><navitop></navitop><!--エラーメッセージ--><div ng-show=error class=\"alert alert-danger\">{{error}}</div><div ng-show=success class=\"alert alert-success\">{{success}}</div><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\">基本情報</h3></div><md-card><md-card-content><!-- <md-card-title-text> --><span class=md-body-1>グループID</span><p class=md-body-3>{{groupId}}</p><!-- </md-card-title-text> --></md-card-content><md-card-content><div layout=row layout-align=\"start end\"><div flex=90 layout=column><span flex class=md-body-1>グループ名</span> <span flex class=md-body-3>{{groupName}}</span></div><md-button class=md-icon-button aria-label=More ng-if=isAdmin><md-icon ng-click=groupNameEdit()><buttonpen></buttonpen></md-icon></md-button></div></md-card-content></md-card><!--ツールバー---><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\">管理</h3></div><div ng-cloak><md-tabs md-dynamic-height md-border-bottom><!--デバイスタブ--><md-tab label=デバイス><md-card><md-list-item class=md-secondary ng-repeat=\"item in deviceList\" ng-click=deviceDetail()><p class=md-body-4>{{item.name}}</p><buttondetail></buttondetail></md-list-item></md-card></md-tab><!--アラートタブ--><md-tab label=アラート通知 ng-if=isAdmin><md-card><md-list-item class=md-secondary ng-repeat=\"item in sendto\" ng-click=null><!-- <div layout> --><p class=md-body-4>{{item.name}}</p><p class=\"md-body-1 mailId\">{{item.mailid}}</p><md-menu><md-button class=md-icon-button ng-click=$mdOpenMenu($event) aria-label=More><i class=material-icons>more_vert</i></md-button><md-menu-content><md-menu-item><md-button ng-click=mailAddressEdit($event,false) aria-label=\"Do something\">編集</md-button></md-menu-item><md-menu-item><md-button ng-click=mailAddressDelete() aria-label=\"Do something\">削除</md-button></md-menu-item></md-menu-content></md-menu><!-- </div> --></md-list-item><!--ボタン--><div layout><md-button flex class=\"md-accent md-button md-ink-ripple md-text-button-1\" type=button ng-click=alertSetting() ng-transclude=\"\"><div class=\"md-ripple-container md-ripple-container-1\">通知設定</div></md-button><md-button flex class=\"md-accent md-button md-ink-ripple md-text-button-2\" type=button ng-click=mailAddressAdd($event,true) ng-transclude=\"\"><div class=\"md-ripple-container md-ripple-container-2\">追加</div></md-button></div></md-card></md-tab></md-tabs></div></div><footer class=footer></footer>"
  );


  $templateCache.put('app/deviceUnit/alertSetting.html',
    "<div ng-controller=AlertSettingCtrl ng-cloak=\"\" class=navBardemoBasicUsage><!--ヘッダー読み込み--><navitop></navitop><!--エラーメッセージ--><div ng-show=error class=\"alert alert-danger\">{{error}}</div><div ng-show=success class=\"alert alert-success\">{{success}}</div><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\">通知闘値</h3></div><md-card><!--switch--><label class=nito-switch-label><span>震度</span><md-switch ng-model=switchSI ng-class=\"{'nito-default':switchSI==true}\" ng-change=switchIntensity(switchSI) style=float:left></md-switch><span class=nito-switch-label>SI値</span></label><md-card-content ng-hide=switchSI><md-card-title-text><md-switch ng-model=switch.seismicIntensity class=md-warn><div ng-if=!!switch.seismicIntensity>通知する</div><div ng-if=!switch.seismicIntensity>通知しない</div></md-switch><!--震度スライダー--><md-slider-container ng-if=!!switch.seismicIntensity><md-slider flex=\"\" min=3 max=7 ng-model=slider.seismicIntensity aria-label=red></md-slider><md-input-container><input flex=\"\" ng-model=slider.seismicIntensity aria-label=red aria-controls=red-slider type=number></md-input-container></md-slider-container></md-card-title-text></md-card-content><md-card-content ng-hide=!switchSI><!--switch--><md-switch ng-model=switch.si class=md-warn><div ng-if=!!switch.si>通知する</div><div ng-if=!switch.si>通知しない</div></md-switch><!--SI値スライダー--><md-slider-container ng-if=!!switch.si><md-slider flex=\"\" min=1 max=140 step=0.1 ng-model=slider.si aria-label=red></md-slider><md-input-container><input flex=\"\" ng-model=slider.si aria-label=red aria-controls=red-slider type=number></md-input-container></md-slider-container></md-card-content><md-card-content><md-card-title-text><!--switch--><label>長周期地震動:</label><md-switch ng-model=switch.longPeriodGroundMotion class=md-warn><div ng-if=!!switch.longPeriodGroundMotion>通知する</div><div ng-if=!switch.longPeriodGroundMotion>通知しない</div></md-switch><!--長周期地震動スライダ--><md-slider-container ng-if=!!switch.longPeriodGroundMotion><md-slider flex=\"\" min=1 max=4 ng-model=slider.longPeriodGroundMotion aria-label=red></md-slider><md-input-container><input flex=\"\" ng-model=slider.longPeriodGroundMotion aria-label=red aria-controls=red-slider type=number></md-input-container></md-slider-container></md-card-title-text></md-card-content><md-card-content><md-card-title-text><!--switch--><label>傾き:</label><md-switch ng-model=switch.slope class=md-warn><div ng-if=!!switch.slope>通知する</div><div ng-if=!switch.slope>通知しない</div></md-switch></md-card-title-text></md-card-content><md-card-content><md-card-title-text><!--switch--><label>雷サージ:</label><md-switch ng-model=switch.lightningSurge class=md-warn><div ng-if=!!switch.lightningSurge>通知する</div><div ng-if=!switch.lightningSurge>通知しない</div></md-switch></md-card-title-text></md-card-content><md-card-content><md-card-title-text><!--switch--><label>商用停電:</label><md-switch ng-model=switch.commercialBlackout class=md-warn><div ng-if=!!switch.commercialBlackout>通知する</div><div ng-if=!switch.commercialBlackout>通知しない</div></md-switch></md-card-title-text></md-card-content><md-card-content><md-card-title-text><!--switch--><label>機器異常:</label><md-switch ng-model=switch.equipmentAbnormality class=md-warn><div ng-if=!!switch.equipmentAbnormality>通知する</div><div ng-if=!switch.equipmentAbnormality>通知しない</div></md-switch></md-card-title-text></md-card-content><div layout><md-button flex class=\"md-accent md-button md-ink-ripple md-text-button-1\" type=button ng-click=cancel() ng-transclude=\"\"><div class=\"md-ripple-container md-ripple-container-1\">キャンセル</div></md-button><md-button flex class=\"md-accent md-button md-ink-ripple md-text-button-2\" type=button ng-click=regist($event,true) ng-transclude=\"\"><div class=\"md-ripple-container md-ripple-container-2\">登録</div></md-button></div></md-card></div><footer class=footer></footer>"
  );


  $templateCache.put('app/deviceUnit/deviceDetail.html',
    "<div ng-controller=DeviceDetailCtrl ng-cloak=\"\" class=navBardemoBasicUsage><!--ヘッダー読み込み--><navitop></navitop><!-- <md-content class=\"md-padding\"> --><!--基本情報--><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\">基本情報</h3></div><md-card><md-card-content><md-card-title-text><span class=md-body-5>{{deviceDetail.deviceName}}</span></md-card-title-text></md-card-content><md-card-content><p class=md-subhead>職場責任者：{{deviceDetail.responsiblePerson}}</p><p class=md-subhead>連絡先：{{deviceDetail.telNo}}</p><p class=md-subhead>住所：{{deviceDetail.address}}</p><p class=md-subhead>メモ：{{deviceDetail.memo}}</p></md-card-content></md-card><!--地震--><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\">地震</h3></div><md-card><!--現在のステータス--><md-list-item class=md-list-item-2 ng-click=\"deviceDetailData(earthquakeCurrentData.data.date_id,'EQ')\" ng-hide=!earthquakeCurrentData><p class=md-body-5>感知あり</p><buttondetail></buttondetail></md-list-item><md-list-item class=md-list-item-2 ng-hide=earthquakeCurrentData><p class=md-body-5>感知なし</p></md-list-item><!--デバイスカード　コンテンツ--><md-card-content ng-hide=!earthquakeCurrentData><!--地震の場合--><p flex class=md-body-1>発生日時：{{earthquakeCurrentData.data.date}}</p><div layout=row layout-wrap><div flex=25><p flex class=md-body-1>傾き</p><p flex class=md-body-1>商用停電</p><p flex class=md-body-1>機器異常</p></div><div flex=40><p flex class=md-body-3 ng-if=earthquakeCurrentData.data.datas.slope>あり（{{earthquakeCurrentData.datas.slope}}）</p><p flex class=md-body-3 ng-if=\"earthquakeCurrentData.data.datas.slope == 0\">なし</p><p flex class=md-body-3 ng-if=earthquakeCurrentData.data.datas.commercialBlackout>あり</p><p flex class=md-body-3 ng-if=!earthquakeCurrentData.data.datas.commercialBlackout>なし</p><p flex class=md-body-3 ng-if=earthquakeCurrentData.data.datas.equipmentAbnormality>あり</p><p flex class=md-body-3 ng-if=!earthquakeCurrentData.data.datas.equipmentAbnormality>なし</p></div><div><div flex class=md-body-1>震度</div><div flex class=md-body-6>{{earthquakeCurrentData.data.datas[0].seismicIntensity}}</div></div></div></md-card-content><md-card-content ng-hide=\"commentList.length == 0 || commentList == undefined\"><p class=md-body-1>コメント・連絡事項</p><div layout=row layout-wrap><ul><li ng-repeat=\"item in commentList\"><p class=md-body-2 ng-if=!item.value.importantFlg>{{item.value.comment}}　{{item.value.timestamp}}</p><p class=\"md-body-2 importantFlg\" ng-if=item.value.importantFlg>{{item.value.comment}}　{{item.value.timestamp}}</p></li></ul></div></md-card-content><!--TODO メディア速報表示させる---><md-card-content ng-hide=\"earthquakeCurrentData.datas.mediaNewsletter == undefined\"><p class=md-body-1>メディア速報</p><p class=md-body-2>気象庁公報：震度{{earthquakeCurrentData.datas.mediaNewsletter[0].japanMeteorologicalAgency}}</p><p class=md-body-2>長周期地震動階級：{{earthquakeCurrentData.datas.mediaNewsletter[0].longPeriodSeismicActivityClass}}</p></md-card-content><!--地震履歴--><md-card-content><p class=md-body-1>地震履歴</p><md-list-item class=md-secondary ng-repeat=\"item in earthquakeHistoryList | limitTo: earthquakeHistoryViews: 0\" ng-click=deviceDetailData()><p class=md-body-1>{{item.data.date}}</p><span class=md-body-1>{{item.data.datas[0].value}}</span> <span class=md-body-1 ng-if=\"item.data.datas[0].value == undefined\">{{item.data.sdata.S}}</span><buttondetail></buttondetail></md-list-item><p flex class=md-body-3 ng-if=\"earthquakeHistoryList.length == 0 || earthquakeHistoryList == undefined\">履歴なし</p><div layout layout-align=center><md-button class=\"md-accent md-button md-ink-ripple\" type=button ng-click=earthquakeHistoryMoreClick() ng-transclude=\"\" ng-hide=\"earthquakeHistoryViews >= earthquakeHistoryList.length  || earthquakeHistoryList == undefined\"><div class=md-ripple-container>さらに表示</div></md-button></div></md-card-content></md-card><!--雷--><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\">雷</h3></div><md-card><!--現在のステータス--><md-list-item class=md-list-item-2 ng-click=\"deviceDetailData(thunderCurrentData.data.date_id,'FL')\" ng-hide=!deviceDetail.thunderCurrentData><p class=md-body-5>感知あり</p><buttondetail></buttondetail></md-list-item><md-list-item class=md-list-item-2 ng-hide=deviceDetail.thunderCurrentData><p class=md-body-5>感知なし</p></md-list-item><!--デバイスカード　コンテンツ--><md-card-content ng-hide=!deviceDetail.thunderCurrentData><p flex class=md-body-1>発生日時：{{deviceDetail.thunderCurrentData.date}}</p><div layout=row layout-wrap><div flex=25><p flex class=md-body-1>漏電</p><p flex class=md-body-1>商用停電</p><p flex class=md-body-1>機器異常</p></div><div flex=40><p flex class=md-body-3 ng-if=thunderCurrentData.datas.leakage>あり</p><p flex class=md-body-3 ng-if=!thunderCurrentData.datas.leakage>なし</p><p flex class=md-body-3 ng-if=thunderCurrentData.datas.commercialBlackout>あり</p><p flex class=md-body-3 ng-if=!thunderCurrentData.datas.commercialBlackout>なし</p><p flex class=md-body-3 ng-if=thunderCurrentData.datas.equipmentAbnormality>あり</p><p flex class=md-body-3 ng-if=!thunderCurrentData.datas.equipmentAbnormality>なし</p></div><div><div flex class=md-body-1>雷</div><div flex class=md-body-6>{{thunderCurrentData.power}}</div></div></div></md-card-content><md-card-content ng-hide=\"thunderCurrentData.datas.commentList == undefined\"><p class=md-body-1>コメント・連絡事項</p><div layout=row layout-wrap><ul><li ng-repeat=\"item in thunderCurrentData.commentList\"><p class=md-body-2>{{item.comment}}　{{item.commentDate}}</p></li></ul></div></md-card-content><md-card-content ng-hide=\"thunderCurrentData.datas.mediaNewsletter == undefined\"><!-- <div layout=\"row\" layout-wrap> --><p class=md-body-1>メディア速報</p><p class=md-body-2>気象庁公報：{{thunderCurrentData.mediaNewsletter[0].japanMeteorologicalAgency}}</p><p class=md-body-2>長周期地震動階級{{thunderCurrentData.mediaNewsletter[0].longPeriodSeismicActivityClass}}</p><!-- </div> --></md-card-content><!--雷履歴--><md-card-content><p class=md-body-1>雷履歴</p><md-list-item class=md-secondary ng-repeat=\"item in thunderHistoryList | limitTo: thunderHistoryViews: 0\" ng-click=deviceDetailData()><p class=md-body-1>{{item.date}}</p><span class=md-body-1 ng-if=\"item.datas[0].value == 1\">小</span> <span class=md-body-1 ng-if=\"item.datas[0].value == 2\">中</span> <span class=md-body-1 ng-if=\"item.datas[0].value == 3\">大</span> <span class=md-body-1 ng-if=\"item.datas[0].value == undefined\">-</span><buttondetail></buttondetail></md-list-item><p flex class=md-body-3 ng-if=\"thunderHistoryList.length == 0 || thunderHistoryList == undefined\">履歴なし</p><div layout layout-align=center><md-button class=\"md-accent md-button md-ink-ripple\" type=button ng-click=thunderHistoryMoreClick() ng-transclude=\"\" ng-hide=\"thunderHistoryViews >= thunderHistoryList.length || thunderHistoryList == undefined\"><div class=md-ripple-container>さらに表示</div></md-button></div></md-card-content></md-card><!-- </md-content> --></div><footer class=footer></footer>"
  );


  $templateCache.put('app/deviceUnit/deviceDetailData.html',
    "<div ng-controller=DeviceDetailDataCtrl ng-cloak=\"\" class=navBardemoBasicUsage><!--ヘッダー読み込み--><navitop></navitop><div ng-show=error class=\"alert alert-danger\">{{error}}</div><div ng-show=success class=\"alert alert-success\">{{success}}</div><!--地震または雷--><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\"><div ng-if=\"detailData.type == 'EQ'\">地震</div><div ng-if=\"detailData.type == 'FL'\"><a class=\"docs-anchor ng-scope\" ng-href=#basic-usage name=basic-usage href=#basic-usage>雷</a></div></h3></div><!--デバイスカード--><md-card><!--デバイスカード　タイトル（デバイス名）--><md-card-content><!--タイトル（デバイス名）--><md-card-title-text><span class=md-body-5>感知あり</span></md-card-title-text></md-card-content><!--デバイスカード　コンテンツ--><md-card-content><!--地震の場合--><div layout=row ng-if=\"detailData.type == 'EQ'\"><div flex=25><p flex class=md-body-1>傾き</p><p flex class=md-body-1>商用停電</p><p flex class=md-body-1>機器異常</p></div><div flex=40><p flex class=md-body-3>{{detailData.slope}}</p><p flex class=md-body-3>{{detailData.commercialBlackout}}</p><p flex class=md-body-3>{{detailData.equipmentAbnormality}}</p></div><div><div flex class=md-body-1>震度</div><div flex class=md-body-6>{{detailData.seismicIntensity}}</div></div></div><!--雷の場合--><div layout=row layout-wrap ng-if=\"detailData.type == 'FL'\"><div flex=25><p flex class=md-body-1>漏電</p><p flex class=md-body-1>商用停電</p><p flex class=md-body-1>機器異常</p></div><div flex=40><p flex class=md-body-3>{{detailData.leakage}}</p><p flex class=md-body-3>{{detailData.commercialBlackout}}</p><p flex class=md-body-3>{{detailData.equipmentAbnormality}}</p></div><div><div flex class=md-body-1>雷</div><div flex class=md-display-3>{{detailData.power}}</div></div></div></md-card-content><md-card-content><p class=md-body-1>コメント・連絡事項</p><div layout=row layout-wrap ng-hide=\"detailData.commentList == undefined\"><ul><li ng-repeat=\"item in detailData.commentList\"><p class=md-body-2 ng-if=!item.value.importantFlg>{{item.value.comment}}　{{item.value.timestamp}}</p><p class=\"md-body-2 importantFlg\" ng-if=item.value.importantFlg>{{item.value.comment}}　{{item.value.timestamp}}</p></li></ul></div><md-button class=\"md-accent md-button md-ink-ripple\" type=button ng-click=addComment() ng-transclude=\"\"><div class=md-ripple-container>コメント追加</div></md-button></md-card-content><md-card-content ng-hide=\"detailData.mediaNewsletter == undefined\"><div class=md-body-1>メディア速報</div><div class=md-body-2>気象庁公報：震度{{detailData.mediaNewsletter.japanMeteorologicalAgency}}</div><div class=md-body-2>長周期地震動階級：{{detailData.mediaNewsletter.longPeriodSeismicActivityClass}}</div></md-card-content></md-card><!--グラフ--><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\">グラフ</h3></div><md-card><md-card-title><span class=md-body-3>合成加速度</span></md-card-title><img ng-src={{chart_acceleration}}></md-card><!--マップ--><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\">マップ</h3></div><md-card><md-content class=md-padding><div id=map-detailData></div></md-content></md-card></div><footer class=footer></footer>"
  );


  $templateCache.put('app/deviceUnit/deviceInfoEdit.html',
    "<div ng-controller=DeviceInfoEditCtrl ng-cloak=\"\" class=navBardemoBasicUsage id=popupContainer><!--ヘッダー読み込み--><navitop></navitop><!--エラーメッセージ--><div ng-show=error class=\"alert alert-danger\">{{error}}</div><div ng-show=success class=\"alert alert-success\">{{success}}</div><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\">基本情報</h3></div><md-card><md-card-content><div layout=row layout-align=\"start end\"><div flex=90 layout=column><span flex class=md-body-1>デバイスID</span> <span flex class=md-body-3>{{deviceGroupData.deviceId}}</span> <span flex class=md-body-3 ng-if=\"deviceGroupData.deviceId == undefined\">-</span></div></div></md-card-content><md-card-content><div layout=row layout-align=\"start end\"><div flex=90 layout=column><span flex class=md-body-1>デバイス名</span> <span flex class=md-body-3>{{deviceGroupData.deviceName}}</span> <span flex class=md-body-3 ng-if=\"deviceGroupData.deviceName == undefined\">-</span></div><md-button class=md-icon-button aria-label=More ng-click=deviceNameEdit($event)><md-icon><buttonpen></buttonpen></md-icon></md-button></div></md-card-content><md-card-content><div layout=row layout-align=\"start end\"><div flex=90 layout=column><span flex class=md-body-1>住所</span> <span flex class=md-body-3>{{deviceGroupData.address}}</span> <span flex class=md-body-3 ng-if=\"deviceGroupData.address == undefined\">-</span></div><md-button class=md-icon-button aria-label=More ng-click=addressEdit($event)><md-icon><buttonpen></buttonpen></md-icon></md-button></div></md-card-content><md-card-content><div layout=row layout-align=\"start end\"><div flex=90 layout=column><span flex class=md-body-1>緯度・経度</span> <span flex class=md-body-3>緯度 {{deviceGroupData.latitude}}</span> <span flex class=md-body-3 ng-if=\"deviceGroupData.latitude == undefined\">緯度 -</span> <span flex class=md-body-3>経度 {{deviceGroupData.longitude}}</span> <span flex class=md-body-3 ng-if=\"deviceGroupData.longitude == undefined\">経度 -</span></div><md-button class=md-icon-button aria-label=More ng-click=latlonEdit($event)><md-icon><buttonpen></buttonpen></md-icon></md-button></div></md-card-content><md-card-content><div layout=row layout-align=\"start end\"><div flex=90 layout=column><span flex class=md-body-1>メモ</span> <span flex class=md-body-3>{{deviceGroupData.memo}}</span> <span flex class=md-body-3 ng-if=\"deviceGroupData.memo == undefined\">-</span></div><md-button class=md-icon-button aria-label=More ng-click=memoEdit($event)><md-icon><buttonpen></buttonpen></md-icon></md-button></div></md-card-content><md-card-content><div layout=row layout-align=\"start end\"><div flex=90 layout=column><span flex class=md-body-1>責任者</span> <span flex class=md-body-3>{{deviceGroupData.responsiblePerson}}</span> <span flex class=md-body-3 ng-if=\"deviceGroupData.responsiblePerson == undefined\">-</span></div><md-button class=md-icon-button aria-label=More ng-click=responsiblePersonEdit($event)><md-icon><buttonpen></buttonpen></md-icon></md-button></div></md-card-content><md-card-content><div layout=row layout-align=\"start end\"><div flex=90 layout=column><span flex class=md-body-1>連絡先</span> <span flex class=md-body-3>{{deviceGroupData.telNo}}</span> <span flex class=md-body-3 ng-if=\"deviceGroupData.telNo == undefined\">-</span></div><md-button class=md-icon-button aria-label=More ng-click=telNoEdit($event)><md-icon><buttonpen></buttonpen></md-icon></md-button></div></md-card-content></md-card><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\">アラート通知</h3></div><md-card><md-list-item class=md-secondary ng-repeat=\"item in sendto\" ng-click=false><p class=md-body-4>{{item.name}}</p><p class=\"md-body-1 mailId\">{{item.mailid}}</p><md-menu><md-button class=md-icon-button ng-click=$mdOpenMenu($event) aria-label=More><i class=material-icons>more_vert</i></md-button><md-menu-content><md-menu-item><md-button ng-click=mailAddressEdit($event,false) aria-label=\"Do something\">編集</md-button></md-menu-item><md-menu-item><md-button ng-click=mailAddressDelete() aria-label=\"Do something\">削除</md-button></md-menu-item></md-menu-content></md-menu></md-list-item><!--ボタン--><div layout><md-button flex class=\"md-accent md-button md-ink-ripple md-text-button-1\" type=button ng-click=alertSetting() ng-transclude=\"\"><div class=\"md-ripple-container md-ripple-container-1\">通知設定</div></md-button><md-button flex class=\"md-accent md-button md-ink-ripple md-text-button-2\" type=button ng-click=mailAddressAdd($event,true) ng-transclude=\"\"><div class=\"md-ripple-container md-ripple-container-2\">追加</div></md-button></div></md-card><footer class=footer></footer><script type=text/ng-template id=dialog1.tmpl.html><form name=\"dialog\">\n" +
    "  <md-dialog class=\"latlonEdit\">\n" +
    "    <md-dialog-content class=\"md-dialog-content\" role=\"document\" tabindex=\"-1\" id=\"dialogContent_2\">\n" +
    "      <h2 class=\"md-title ng-binding\">緯度・経度</h2>\n" +
    "      <div class=\"md-dialog-content-body ng-scope\">\n" +
    "       <p class=\"ng-binding\"></p>\n" +
    "     </div>\n" +
    "   <!--MAP-->\n" +
    "   <div class=\"map mapEdit\">\n" +
    "     <ui-gmap-google-map center=\"map.center\" zoom=\"map.zoom\" events=\"map.events\" draggable=\"true\" bounds=\"map.bounds\" control=\"map.control\">\n" +
    "       <ui-gmap-markers models=\"markers\" coords=\"'self'\" icon=\"'icon'\"></ui-gmap-markers>\n" +
    "     </ui-gmap-google-map>\n" +
    "   </div>\n" +
    "   <div class=\"md-body-1\">緯度 {{latitude}}</div>\n" +
    "   <div class=\"md-body-1\">経度 {{longitude}}</div>\n" +
    "   </md-dialog-content>\n" +
    "   <md-dialog-actions>\n" +
    "   <button class=\"md-primary md-cancel-button md-button ng-scope md-default-theme md-ink-ripple\" type=\"button\" ng-click=\"closeDialog()\" style=\"\">キャンセル</button>\n" +
    "   <button class=\"md-primary md-confirm-button md-button md-ink-ripple md-default-theme\" type=\"button\" ng-click=\"regist()\">登録</button>\n" +
    "   </md-dialog-actions>\n" +
    "   </md-dialog>\n" +
    "   </form></script></div>"
  );


  $templateCache.put('app/deviceUnit/envLog.html',
    "<div ng-controller=EnvLogCtrl ng-cloak=\"\" class=navBardemoBasicUsage><!--ヘッダー読み込み--><navitop></navitop><md-card><md-card-content><div ng-if=gType><img src=/assets/images/dummy_figure.png style=width:100%></div><div ng-if=!gType><img src=/assets/images/dummy_figure2.png style=width:100%></div><div layout layout-align=center><md-button class=\"md-accent md-button md-ink-ripple\" type=button ng-click=backtoList() ng-transclude=\"\"><div class=md-ripple-container>戻る</div></md-button></div></md-card-content></md-card></div><footer class=footer></footer>"
  );


  $templateCache.put('app/documents/documents.html',
    "<div ng-controller=DocumentsSettingCtrl ng-cloak=\"\" class=navBardemoBasicUsage><!--ヘッダー読み込み--><navitop></navitop><md-card><md-card-content><md-list-item ng-click=\"catalogDL('a')\"><p class=md-body-2>商品A　カタログ</p><buttondetail></buttondetail></md-list-item><md-list-item ng-click=\"catalogDL('b')\"><p class=md-body-2>商品B　カタログ</p><buttondetail></buttondetail></md-list-item></md-card-content></md-card></div><footer class=footer></footer>"
  );


  $templateCache.put('app/downloadCSV/downloadCsvItemSetting.html',
    "<div ng-controller=DownloadCsvItemSettingCtrl ng-cloak=\"\" class=navBardemoBasicUsage><!--ヘッダー読み込み--><navitop></navitop><!--エラーメッセージ--><div ng-show=error class=\"alert alert-danger\">{{error}}</div><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\">CSVデータ設定</h3></div><md-card><!--開始期間--><md-card-content><md-input-container class=nito-datepicker><label>開始期間</label><md-datepicker ng-model=downloadStartDate></md-datepicker></md-input-container></md-card-content><!--終了期間--><md-card-content><md-input-container class=nito-datepicker><label>終了期間</label><md-datepicker ng-model=downloadEndDate></md-datepicker></md-input-container></md-card-content><!--デバイスセレクトボックス--><md-card-content><md-input-container class=md-block flex-gt-sm><label>デバイス</label><md-select ng-model=deviceList><md-option ng-repeat=\"item in deviceList\" value={{item.id}}>{{item.name}}</md-option></md-select></md-input-container></md-card-content><!--デバイスセレクトボックス--><!--ダウンロードデータセレクトボックス--><md-card-content><md-input-container class=md-block flex-gt-sm><label>ダウンロードデータ</label><md-select ng-model=selectItem><md-option ng-repeat=\"item in selectItems\" value={{item.value}}>{{item.label}}</md-option></md-select></md-input-container></md-card-content><md-card-content><!--ダウンロードボタン--><div layout layout-align=center><md-button class=\"md-accent md-button md-ink-ripple\" type=button ng-click=download() ng-transclude=\"\"><div class=md-ripple-container>ダウンロード</div></md-button></div></md-card-content></md-card></div><footer class=footer></footer>"
  );


  $templateCache.put('app/login/login.html',
    "<!--ログイン画面--><div ng-controller=LoginCtrl><div ng-show=error class=\"alert alert-danger\">{{error}}</div><md-card class=loginbar><div class=logoContent><img src=/assets/images/nito_logo.png><div class=md-body-8>ホームチェッカー</div></div></md-card><md-card class=loginContent><input type=hidden ng-value=user.query ng-init=\"user.query = getQuery()\"><div class=\"md-body-7 loginText\">Login</div><md-input-container class=md-block><label>ID</label><input ng-model=user.userId></md-input-container><md-input-container class=md-block><label>パスワード</label><input ng-model=user.password></md-input-container><div layout layout-align=center><md-button flex class=\"md-accent md-button md-ink-ripple md-text-button-2\" type=button ng-click=login() ng-transclude=\"\"><div class=\"md-ripple-container md-ripple-container-2\">ログイン</div></md-button></div></md-card><!-- <button class=\"btn btn-primary\" type=\"buttom\" ng-click=\"login()\">Login</button> --></div>"
  );


  $templateCache.put('components/modal/modal.html',
    "<div class=modal-header><button ng-if=modal.dismissable type=button ng-click=$dismiss() class=close>&times;</button><h4 ng-if=modal.title ng-bind=modal.title class=modal-title></h4></div><div class=modal-body><p ng-if=modal.text ng-bind=modal.text></p><div ng-if=modal.html ng-bind-html=modal.html></div></div><div class=modal-footer><button ng-repeat=\"button in modal.buttons\" ng-class=button.classes ng-click=button.click($event) ng-bind=button.text class=btn></button></div>"
  );


  $templateCache.put('components/navbar/navbar.html',
    "<div class=\"navbar navbar-default navbar-static-top\" ng-controller=NavbarCtrl><!-- <div class=\"container\"> --><div><!-- <div class=\"navbar-header\">\n" +
    "      <div layout=\"colom\">\n" +
    "      <md-button class=\"md-icon-button md-primary humbergerMenu\" ng-click=\"toggleLeft()\" aria-label=\"Settings\">\n" +
    "        <i class=\"material-icons\">menu</i>\n" +
    "      </md-button>\n" +
    "      <div class=\"navbar-brand\">{{navtitle}}</div>\n" +
    "    </div>\n" +
    "    </div> --><md-toolbar class=md-hue-2><div class=\"md-toolbar-tools commonNavbar\"><!-- <md-button class=\"md-icon-button\" aria-label=\"Settings\" ng-disabled=\"true\">\n" +
    "          <md-icon md-svg-icon=\"img/icons/menu.svg\"></md-icon>\n" +
    "        </md-button> --><md-button class=\"md-icon-button md-primary humbergerMenu\" ng-click=toggleLeft() aria-label=Settings><!-- <i class=\"material-icons\">menu</i> --><svg width=24px height=24px viewbox=\"16 40 24 24\" version=1.1 xmlns=http://www.w3.org/2000/svg xmlns:xlink=http://www.w3.org/1999/xlink><!-- Generator: Sketch 42 (36781) - http://www.bohemiancoding.com/sketch --><desc>Created with Sketch.</desc><defs></defs><g id=Material/Icons-black/menu stroke=none fill=none opacity=0.54 transform=\"translate(16.000000, 40.000000)\" fill-rule=evenodd><path d=\"M3,18 L21,18 L21,16 L3,16 L3,18 L3,18 Z M3,13 L21,13 L21,11 L3,11 L3,13 L3,13 Z M3,6 L3,8 L21,8 L21,6 L3,6 L3,6 Z\" id=Shape fill=#000000></path></g></svg></md-button><h2 flex=\"\" md-truncate=\"\">{{navtitle}}</h2></div></md-toolbar></div></div><!---メニュー---><section layout=row flex=\"\"><md-sidenav class=md-sidenav-left md-component-id=left md-disable-backdrop=\"\" md-whiteframe=4><md-list-item class=md-3-line ng-repeat=\"item in menuItem\" ng-click=menuItemClick(item.url)><p class=md-body-4>{{item.label}}</p></md-list-item></md-sidenav></section>"
  );

}]);
