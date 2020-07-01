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
                        <v-checkbox
                                v-model="caseSensitive"
                                dark
                                hide-details
                                :label="this.$t('lang.casesensitivesearch')"
                        ></v-checkbox>
                    </v-sheet>
                    <v-card-text>
                        <v-treeview
                                item-text="text"
                                hoverable
                                :items="menuTree"
                                :search="search"
                                :filter="filter"
                        >
                            <template slot="label" slot-scope="{ item }">
                                <v-icon
                                        v-if="item.icon!=null&&item.icon!='mdi-chevron-up'"
                                        v-text="item.icon"
                                ></v-icon>
                                <a @click="clickMenuTree(item)">{{ item.text }}</a>
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
                                @click="clean_menu()"
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
                                            :items="allMenuList"
                                            v-model="menu.parentUuid"
                                            :label="this.$t('lang.parentmenu')"
                                            item-value="uuid"
                                            item-text="text"
                                            :error="parentUuiderror"
                                            outlined
                                    ></v-select>

                                    <v-text-field
                                            v-model="menu.text"
                                            :label="this.$t('lang.name')"
                                            :error="texterror"
                                            outlined
                                            required
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="menu.href"
                                            :label="this.$t('lang.address')"
                                            outlined
                                            required
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="menu.icon"
                                            :label="this.$t('lang.icon')"
                                            outlined
                                            required
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="menu.remarks"
                                            :label="this.$t('lang.remarks')"
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
                                    <v-radio-group v-model="menu.isMenu" row style="padding: 0 0 24px 0;">
                                        <v-radio :label="this.$t('lang.menu')" value="true"></v-radio>
                                        <v-radio :label="this.$t('lang.jurisdiction')" value="false"></v-radio>
                                    </v-radio-group>

                                    <v-text-field
                                            v-model="menu.permission"
                                            :label="this.$t('lang.permissionid')"
                                            outlined
                                            required
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="menu.target"
                                            :label="this.$t('lang.target')"
                                            outlined
                                            required
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="menu.sort"
                                            :label="this.$t('lang.sort')"
                                            outlined
                                            required
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="menu.i18n"
                                            label="i18n"
                                            outlined
                                            required
                                    ></v-text-field>

                                    <v-switch v-model="menu.isShow" :label="this.$t('lang.visibleornot')" inset></v-switch>
                                </v-form>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-text style="height: 80px; position: relative">
                        <v-btn
                                color="error"
                                class="mr-4"
                                @click="btn_delete"
                                absolute
                                dark
                                top
                                right
                                style="right: 80px;"
                        >
                            {{$t("lang.delete")}}
                        </v-btn>

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

                    <v-dialog
                            v-model="delete_dialog"
                            max-width="290"
                    >
                        <v-card>
                            <v-card-title class="headline">{{$t("lang.warning")}}</v-card-title>

                            <v-card-text>
                                {{$t("lang.areyousureyouwanttodeleteitThisoperationisirreversible")}}
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>

                                <v-btn
                                        text
                                        @click="delete_dialog = false"
                                >
                                    {{$t("lang.cancel")}}
                                </v-btn>

                                <v-btn
                                        text
                                        @click="delete_do"
                                >
                                    {{$t("lang.yes")}}
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script type="text/ecmascript-6">
    import {
        getSettingMenuTree,
        getSettingMenuList,
        getSettingMenu,
        addSettingMenu,
        updateSettingMenu,
        deleteSettingMenu
    } from '../api/index'

    export default {
        data(){
            return {
                delete_dialog: false,
                parentUuiderror: false,
                texterror: false,
                edit_overlay: false,
                menuTree: [],
                search: null,
                caseSensitive: false,
                valid: true,
                menu: {
                    uuid: "",
                    parentUuid: "",
                    icon: "",
                    text: "",
                    sort: "",
                    href: "",
                    target: "",
                    permission: "",
                    remarks: "",
                    isDelete: false,
                    i18n: "",
                    isShow: true,
                    isMenu: "true"
                },
                allMenuList: [],
                name: ''
            }
        },
        computed: {
            filter () {
                return this.caseSensitive
                    ? (item, search, textKey) => item[textKey].indexOf(search) > -1
                    : undefined
            },
        },
        created(){
            // this.load_setting_menu_tree();
            // this.local_setting_menu_list();
        },
        inject:['getTenantID'],
        methods: {
            clickMenuTree(item){
                this.edit_overlay = true;
                let params = {};
                params.uuid = item.uuid;
                getSettingMenu(params).then(res => {
                    if (res.code == 200) {
                        this.local_setting_menu_list();
                        this.menu.uuid = res.data.uuid;
                        this.menu.parentUuid = res.data.parentUuid;
                        this.menu.icon = res.data.icon;
                        this.menu.text = res.data.text;
                        this.menu.sort = res.data.sort;
                        this.menu.href = res.data.href;
                        this.menu.target = res.data.target;
                        this.menu.permission = res.data.permission;
                        this.menu.remarks = res.data.remarks;
                        this.menu.isDelete = res.data.isDelete;
                        this.menu.i18n = res.data.i18n;
                        this.menu.isShow = res.data.isShow;
                        this.menu.isMenu = res.data.isMenu.toString();
                    }
                    this.edit_overlay = false;
                    console.log(this.menu.parentUuid);
                });
            },
            load_setting_menu_tree(){
                let params = {};
                getSettingMenuTree(params).then(res => {
                    this.menuTree = res.data;
                });
            },
            local_setting_menu_list(){
                let params = {};
                getSettingMenuList(params).then(res => {
                    this.allMenuList = res.data;
                });
            },
            clean_menu(){
                this.parentUuiderror = false;
                this.texterror = false;
                this.menu = {
                    uuid: "",
                    parentUuid: "",
                    icon: "",
                    text: "",
                    sort: "",
                    href: "",
                    target: "",
                    permission: "",
                    remarks: "",
                    isDelete: false,
                    i18n: "",
                    isShow: true,
                    isMenu: "true"
                };
            },
            delete_do(){
                let params = this.menu;
                deleteSettingMenu(params).then(res=>{
                    if (res.code == 200) {
                        this.load_setting_menu_tree();
                        this.local_setting_menu_list();
                        this.$message("OK", "info");
                        this.clean_menu();
                    } else {
                        this.$message(this.$t("lang.error") + res.message, "error");
                    }
                });
                this.delete_dialog = false;
            },
            btn_delete(){
                if(this.menu.uuid===""){
                    this.$message(this.$t("lang.pleaseselecttheelementtooperatefirst"), "error");
                    return false;
                }
                this.delete_dialog = true;
            },
            btn_yes () {
                let params = this.menu;
                if (this.check_menu()) {
                    if (params.isMenu === "true") {
                        params.isMenu = true;
                    } else {
                        params.isMenu = false;
                    }
                    if (this.menu.uuid === "") {
                        // 新增
                        addSettingMenu(params).then(res => {
                            if (res.code == 200) {
                                this.load_setting_menu_tree();
                                this.local_setting_menu_list();
                                this.$message("OK", "info");
                                this.clean_menu();
                            } else {
                                this.$message(this.$t("lang.error") + res.message, "error");
                            }
                        });
                    } else {
                        // 修改
                        updateSettingMenu(params).then(res => {
                            if (res.code == 200) {
                                this.load_setting_menu_tree();
                                this.local_setting_menu_list();
                                this.$message("OK", "info");
                                this.clean_menu();
                            } else {
                                this.$message(this.$t("lang.error") + res.message, "error");
                            }
                        });
                    }
                    if (params.isMenu) {
                        params.isMenu = "true";
                    } else {
                        params.isMenu = "false";
                    }
                }
            },
            check_menu(){
                if (this.menu.parentUuid === "") {
                    this.parentUuiderror = true;
                    return false;
                }
                if (this.menu.text === "") {
                    this.texterror = true;
                    return false;
                }
                return true;
            }
        }
    }
</script>