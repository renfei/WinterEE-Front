<template>
    <v-container class="fill-height settingMenu" :fluid=true style="align-items: normal;">
        <v-row>
            <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
                <v-card class="mx-auto">
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                                <v-form>
                                    <v-text-field
                                            v-model="tenantInfo.name"
                                            :label="this.$t('lang.name')"
                                            readonly
                                            outlined
                                            required
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="tenantInfo.administrators"
                                            :label="this.$t('lang.administrators')"
                                            outlined
                                            required
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="tenantInfo.longitude"
                                            :label="this.$t('lang.longitude')"
                                            outlined
                                            required
                                    ></v-text-field>
                                    <v-text-field
                                            v-model="tenantInfo.address"
                                            :label="this.$t('lang.address')"
                                            outlined
                                            required
                                    ></v-text-field>
                                </v-form>
                            </v-col>
                            <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                                <v-form
                                        ref="form"
                                        v-model="valid"
                                >
                                    <v-text-field
                                            v-model="tenantInfo.tenantUuid"
                                            label="UUID"
                                            readonly
                                            outlined
                                            required
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="tenantInfo.contact"
                                            :label="this.$t('lang.contact')"
                                            outlined
                                            required
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="tenantInfo.latitude"
                                            :label="this.$t('lang.latitude')"
                                            outlined
                                            required
                                    ></v-text-field>

                                </v-form>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <baidu-map class="bm-view"
                                           style="height: 300px;"
                                           :center="center"
                                           :zoom="zoom"
                                           :scroll-wheel-zoom="true"
                                           @moving="syncCenterAndZoom"
                                           @moveend="syncCenterAndZoom"
                                           @zoomend="syncCenterAndZoom"
                                           @click="mapclick"
                                           ak="OljGGx6QqphRhH277gS63dUqzcF4zQwt">
                                </baidu-map>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-text style="height: 80px; position: relative">
                        <v-btn
                                color="green"
                                @click="btn_yes"
                                absolute
                                dark
                                top
                                right
                        >
                            {{$t("lang.save")}}
                        </v-btn>
                    </v-card-text>
                    <v-overlay
                            :absolute="true"
                            :value="edit_overlay"
                    >
                        <v-progress-circular indeterminate size="64"></v-progress-circular>
                    </v-overlay>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script type="text/ecmascript-6">
    import {
        getTeantInfo,
        updateTeantInfo,
        addSettingMenu,
        updateSettingMenu
    } from '../api/index'

    export default {
        inject: ['getTenantID'],
        data() {
            return {
                edit_overlay: false,
                valid: true,
                tenantInfo: {
                    tenantUuid: "",
                    uuid: "",
                    name: "",
                    administrators: "",
                    contact: "",
                    address: "",
                    longitude: 0,
                    latitude: 0,
                },
                name: '',
                center: {lng: 116.403957, lat: 39.914812},
                zoom: 17
            }
        },
        created() {
            this.tenantInfo.tenantUuid = this.getTenantID();
            let params = {
                tenantUUID: this.tenantInfo.tenantUuid
            };
            getTeantInfo(params).then(res => {
                if (res.code === 200) {
                    this.tenantInfo = res.data;
                    if(res.data.longitude!=undefined&&res.data.latitude!=undefined){
                        this.center.lng = res.data.longitude;
                        this.center.lat = res.data.latitude;
                    }
                }
            });
        },
        methods: {
            syncCenterAndZoom(e) {
                const {lng, lat} = e.target.getCenter()
                this.center.lng = lng
                this.center.lat = lat
                this.zoom = e.target.getZoom()
            },
            mapclick(e) {
                this.tenantInfo.longitude = e.point.lng;     //通过  e.point.lng获取经度
                this.tenantInfo.latitude = e.point.lat;     //通过  e.point.lat获取纬度
                let geocoder = new BMap.Geocoder();  //创建地址解析器的实例
                geocoder.getLocation(e.point, rs => {
                    this.tenantInfo.address = rs.address;
//                    console.log(rs.address);
                });
            },
            btn_yes() {
                let params = this.tenantInfo;
                updateTeantInfo(params).then(res=>{
                    if(res.code===200){
                        this.$message("OK", "info");
                    }
                });
            }
        }
    }
</script>