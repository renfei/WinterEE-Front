<template>
    <v-container class="fill-height settingMenu" :fluid=true style="align-items: normal;">
        <v-row>
            <v-col cols="12" xs="12" sm="6" md="4" lg="4" xl="3">
                <v-card class="mx-auto">
                    <v-sheet class="pa-4 primary lighten-2">
                        <v-text-field
                                v-model="search"
                                :label="this.$t('lang.searchdirectory')"
                                dark
                                flat
                                solo-inverted
                                hide-details
                                clearable
                                clear-icon="mdi-close-circle-outline"
                        ></v-text-field>
                    </v-sheet>
                    <v-card-text>
                        <v-treeview
                                item-text="name"
                                hoverable
                                :open-all="true"
                                :items="organizationList"
                                :search="search"
                        >
                            <template slot="label" slot-scope="{ item }">
                                <a @click="clickOrganizationList(item)">{{ item.name }}</a>
                            </template>
                        </v-treeview>
                    </v-card-text>
                    <v-card-text style="height: 50px; position: relative">
                        <v-btn
                                absolute
                                dark
                                fab
                                top
                                right
                                color="pink"
                                @click="clean()"
                        >
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" xs="12" sm="6" md="8" lg="8" xl="9">
                <v-card class="mx-auto">
                    <v-toolbar dense dark class="primary lighten-2">
                        <v-toolbar-title>{{$t("lang.edit")}}</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                                <v-form>
                                    <v-select
                                            :items="parentList"
                                            v-model="organization.parentUuid"
                                            :label="this.$t('lang.parent')"
                                            item-value="uuid"
                                            item-text="name"
                                            :error="parentUuiderror"
                                            outlined
                                    ></v-select>

                                    <v-text-field
                                            v-model="organization.master"
                                            :label="this.$t('lang.master')"
                                            outlined
                                            required
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="organization.email"
                                            :label="this.$t('lang.email')"
                                            outlined
                                            required
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="organization.primaryPerson"
                                            :label="this.$t('lang.primary_person')"
                                            outlined
                                            required
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="organization.address"
                                            :label="this.$t('lang.address')"
                                            outlined
                                            required
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="organization.longitude"
                                            :label="this.$t('lang.longitude')"
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
                                            v-model="organization.name"
                                            :label="this.$t('lang.name')"
                                            outlined
                                            required
                                            :error="texterror"
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="organization.phone"
                                            :label="this.$t('lang.telephone')"
                                            outlined
                                            required
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="organization.fax"
                                            :label="this.$t('lang.fax')"
                                            outlined
                                            required
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="organization.deputyPerson"
                                            :label="this.$t('lang.deputy_person')"
                                            outlined
                                            required
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="organization.zipCode"
                                            :label="this.$t('lang.zipCode')"
                                            outlined
                                            required
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="organization.latitude"
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
                                           @click="mapclick">
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
        getCompanyList,
        addCompany,
        updateCompany,
        getSettingMenu,
    } from '../../api/index'

    export default {
        inject: ['getTenantID'],
        data() {
            return {
                parentUuiderror: false,
                texterror: false,
                edit_overlay: false,
                search: null,
                valid: true,
                organizationList: [],
                parentList: [],
                organization: {
                    id: "",
                    uuid: "",
                    tenantUuid: "",
                    parentUuid: "",
                    orgType: "",
                    name: "",
                    address: "",
                    zipCode: "",
                    master: "",
                    phone: "",
                    fax: "",
                    email: "",
                    primaryPerson: "",
                    deputyPerson: "",
                    createBy: "",
                    createTime: "",
                    updateBy: "",
                    updateTime: "",
                    remarks: "",
                    delFlag: "",
                    longitude: 0,
                    latitude: 0,
                },
                name: '',
                center: {lng: 116.403957, lat: 39.914812},
                zoom: 17
            }
        },
        computed: {},
        created() {
            this.load_company_tree();
        },
        methods: {
            syncCenterAndZoom(e) {
                const {lng, lat} = e.target.getCenter()
                this.center.lng = lng
                this.center.lat = lat
                this.zoom = e.target.getZoom()
            },
            mapclick(e) {
                this.organization.longitude = e.point.lng;     //通过  e.point.lng获取经度
                this.organization.latitude = e.point.lat;     //通过  e.point.lat获取纬度
                let geocoder = new BMap.Geocoder();  //创建地址解析器的实例
                geocoder.getLocation(e.point, rs => {
                    this.organization.address = rs.address;
//                    console.log(rs.address);
                });
            },
            clickOrganizationList(item) {
                if (!item.isTenant) {
                    this.edit_overlay = true;
                    this.organization = item;
                    if (item.longitude !== undefined &&
                        item.latitude !== undefined &&
                        item.longitude !== "" &&
                        item.latitude !== "" &&
                        item.longitude !== null &&
                        item.latitude !== null) {
                        this.center.lng = item.longitude;
                        this.center.lat = item.latitude;
                    }
                    this.edit_overlay = false;
                }
            },
            load_company_tree() {
                let params = {};
                params.tenantUuid = this.getTenantID();
                getCompanyList(params).then(res => {
                    this.organizationList = res.data;
                    this.parentList = [];
                    const item = {};
                    item.uuid = this.organizationList[0].uuid;
                    item.name = this.organizationList[0].name;
                    this.parentList.push(item);
                    this.build_parent_list(res.data[0].children);
                });
            },
            build_parent_list(list) {
                for (let i = 0; i < list.length; i++) {
                    if (!list[i].isTenant) {
                        const item = {};
                        item.uuid = list[i].uuid;
                        item.name = list[i].name;
                        this.parentList.push(item);
                        if (list[i].children != undefined) {
                            this.build_parent_list(list[i].children);
                        }
                    }
                }
            },
            clean() {
                this.organization = {
                    id: "",
                    uuid: "",
                    tenantUuid: "",
                    parentUuid: "",
                    orgType: "",
                    name: "",
                    address: "",
                    zipCode: "",
                    master: "",
                    phone: "",
                    fax: "",
                    email: "",
                    primaryPerson: "",
                    deputyPerson: "",
                    createBy: "",
                    createTime: "",
                    updateBy: "",
                    updateTime: "",
                    remarks: "",
                    delFlag: "",
                    longitude: 0,
                    latitude: 0,
                };
            },
            btn_yes() {
                if (this.check_company()) {
                    let params = this.organization;
                    this.organization.tenantUuid = this.getTenantID();
                    if (this.organization.uuid === "") {
                        // 新增
                        addCompany(params).then(res => {
                            if (res.code == 200) {
                                this.$message("OK", "info");
                                this.load_company_tree();
                            } else {
                                this.$message(this.$t("lang.error") + res.message, "error");
                            }
                        });
                    } else {
                        // 修改
                        updateCompany(params).then(res => {
                            if (res.code == 200) {
                                this.$message("OK", "info");
                                this.load_company_tree();
                            } else {
                                this.$message(this.$t("lang.error") + res.message, "error");
                            }
                        });
                    }
                }
            },
            check_company() {
                if (this.organization.parentUuid === "") {
                    this.parentUuiderror = true;
                    return false;
                }
                if (this.organization.name === "") {
                    this.texterror = true;
                    return false;
                }
                return true;
            }
        }
    }
</script>