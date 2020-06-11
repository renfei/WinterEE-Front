<template>
    <v-app id="Main">
        <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
            <v-toolbar-title style="width: 200px" class="ml-0 pl-4">
                <span class="hidden-sm-and-down">{{$t("lang.dashboard")}}</span>
            </v-toolbar-title>
            <v-spacer/>
            <v-row align="center" style="max-width: 150px;margin-right: 10px;">
                <v-col>
                    <v-select :items="tenants" v-model="this.tenantID" item-text="name" item-value="uuid"
                              @change="changeTenant"
                              :dense="true" v-if="this.showTenantList"
                              hide-details outlined></v-select>
                </v-col>
            </v-row>
            <v-row align="center" style="max-width: 150px">
                <v-col>
                    <v-select :items="lang_items" v-model="this.$i18n.locale" @change="lang_change" :dense="true"
                              hide-details outlined></v-select>
                </v-col>
            </v-row>
            <v-btn icon>
                <v-icon>mdi-apps</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>mdi-bell</v-icon>
            </v-btn>
            <v-btn icon large>
                <v-avatar size="32px" item>
                    <v-img :src="require('./assets/profile_pic.svg')" alt="profile"/>
                </v-avatar>
            </v-btn>
        </v-app-bar>
        <!--v-app-bar end-->
        <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <v-list dense>
                <template v-for="item in items">
                    <v-list-group
                            v-if="item.children"
                            :key="item.text"
                            v-model="item.model"
                            :prepend-icon="item.model ? item.icon : item['icondown']"
                            append-icon=""
                    >
                        <template v-slot:activator>
                            <v-list-item-content @click="menu_click(item)">
                                <v-list-item-title>
                                    {{ item.text }}
                                </v-list-item-title>
                            </v-list-item-content>
                        </template>
                        <v-list-item
                                v-for="(child, i) in item.children"
                                :key="i"
                                link
                        >
                            <v-list-item-action v-if="child.icon">
                                <v-icon>{{ child.icon }}</v-icon>
                            </v-list-item-action>
                            <v-list-item-content @click="menu_click(child)">
                                <v-list-item-title>
                                    {{ child.text }}
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-group>
                    <v-list-item
                            v-else
                            :key="item.text"
                            link
                    >
                        <v-list-item-action @click="menu_click(item)">
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-action>
                        <v-list-item-content @click="menu_click(item)">
                            <v-list-item-title>
                                {{ item.text }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template>
            </v-list>
        </v-navigation-drawer>
        <!--v-navigation-drawer end-->
        <v-content>
            <v-container class="fill-height" fluid>
                <router-view :key="routerKey"></router-view>
            </v-container>
        </v-content>
    </v-app>
</template>
<script>
    import {getMenuTree, getMyInfo, getTeantList} from './api/index'
    import locale from './libs/locale'
    import router from './router/index';

    export default {
        name: 'main',
        props: {
            source: String,
        },
        data: () => ({
            routerKey: "",
            locale: "",
            lang_items: locale.list(),
            tenants: [],
            showTenantList: false,
            dialog: false,
            drawer: null,
            items: [],
            tenantID: "",
            myinfo: {
                authorities: [],
                createTime: "",
                email: "",
                lockTime: "",
                passwd: "",
                phone: "",
                tenantUuid: "",
                userName: "",
                userStatus: "",
                uuid: ""
            },
        }),
        created() {
            this.load_menu();
            this.load_myinfo();
            this.load_teantList();
        },
        methods: {
             load_myinfo() {
                let params = {};
                 getMyInfo(params).then(res => {
                    this.myinfo = res.data;
                    this.tenantID = this.myinfo.tenantUuid;
                    return res.data;
                });
            },
            load_teantList() {
                let params = {};
                getTeantList(params).then(res => {
                    this.tenants = res.data.data;
                    if (this.tenants.length >= 1) {
                        this.showTenantList = true;
                    } else {
                        this.showTenantList = false;
                    }
                });
            },
            load_menu() {
                let params = {
                    tenant: this.tenantID,
                    language: this.getStore('locale')
                };
                getMenuTree(params).then(res => {
                    this.items = res.data;
                });
            },
            lang_change(any) {
                locale.setLocale(any);
                this.$i18n.locale = this.getStore('locale');
                this.load_menu();
                this.routerKey = new Date().getTime();
            },
            changeTenant(any) {
                this.tenantID = any;
            },
            menu_click(value) {
                if (value.href != null && value.href != undefined && value.href != "") {
                    if (value.target === "_blank") {
                        window.open(value.href);
                    } else {
                        if (value.href.indexOf("/") == 0) {
                            router.push(value.href);
                        } else if (value.href.indexOf("http") == 0) {
                            window.location.href = value.href;
                        }
                    }
                }
            },
            getTenantID() {
                return this.tenantID;
            }
        },
        // 父组件中返回要传给下级的数据
        provide () {
            return {
                getTenantID: this.getTenantID
            }
        },
    }
</script>
