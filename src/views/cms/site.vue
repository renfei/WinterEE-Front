<template>
    <v-container class="fill-height" :fluid=true style="align-items: normal;">
        <v-data-table
                :headers="headers"
                :items="desserts"
                :items-per-page="options.rows"
                :page="options.page"
                :options.sync="options"
                :server-items-length="serveritemslength"
                item-key="uuid"
                class="elevation-1"
                style="width: 100%"
        >
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>{{$t("lang.sitemanagement")}}</v-toolbar-title>
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                    color="primary"
                                    dark
                                    class="mb-2"
                                    v-bind="attrs"
                                    v-on="on"
                            >{{ $t("lang.newitem")}}
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="site.siteName" label="站点名称" outlined
                                                          required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="site.siteDomain" label="域名" outlined
                                                          required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-select v-model="site.officeUuid"
                                                      :items="companys"
                                                      label="所属公司"
                                                      item-text="name"
                                                      item-value="uuid"
                                                      @change="changecompanylist"
                                                      outlined></v-select>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-select
                                                    item-text="name"
                                                    item-value="uuid"
                                                    v-model="site.departmentUuid"
                                                    :items="department"
                                                    label="所属部门"
                                                    outlined></v-select>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="site.siteKeyword" label="关键字" outlined
                                                          required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="site.siteDescription" label="站点描述" outlined
                                                          required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="site.icpNo" label="ICP备案号" outlined
                                                          required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="site.gonganNo" label="公安备案号" outlined
                                                          required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-switch
                                                    v-model="site.isComment"
                                                    label="全局评论开关"
                                            ></v-switch>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-text-field v-model="site.analysisCode" label="第三方统计代码" outlined
                                                          required></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">{{ $t("lang.cancel")}}</v-btn>
                                <v-btn color="blue darken-1" text @click="save">{{ $t("lang.save")}}</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon
                        small
                        class="mr-2"
                        @click="editItem(item)"
                >
                    mdi-pencil
                </v-icon>
                <v-icon
                        small
                        @click="deleteItem(item)"
                >
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
    import {
        getSiteList,
        addSite,
        updateSite,
        deleteSite,
        getCompanySimpleList,
        getDepartmentSimpleList,
    } from '../../api/index'
    import utils from "../../libs/utils";

    export default {
        inject: ['getTenantID'],
        data: () => ({
            options: {
                page: 1,
                itemsPerPage: 10,
                pageStart: 1,
                pageStop: 1,
                sortDesc: [false, false]
            },
            serveritemslength: 0,
            department: [],
            dialog: false,
            headers: [
                {text: "名称", value: 'siteName'},
                {text: '域名', value: 'siteDomain'},
                {text: '租户', value: 'tenantName'},
                {text: '公司', value: 'officeName'},
                {text: '创建人', value: 'createByName'},
                {text: '创建时间', value: 'createTime'},
                {text: '修改人', value: 'updateByName'},
                {text: '修改时间', value: 'updateTime'},

                {text: 'Actions', value: 'actions', sortable: false},
            ],
            desserts: [],
            selectionType: "independent",
            selection: [],
            editedIndex: -1,
            site: {
                uuid: "",
                tenantUuid: "",
                tenantName: "",
                officeUuid: "",
                officeName: "",
                departmentUuid: "",
                siteName: "",
                siteDomain: "",
                siteKeyword: "",
                siteDescription: "",
                icpNo: "",
                isComment: true,
                gonganNo: "",
                analysisCode: "",
                createTime: "",
                createBy: "",
                createByName: "",
                updateTime: "",
                updateBy: "",
                updateByName: "",
                siteEnable: true,
            },
            defaultItem: {
                uuid: "",
                tenantUuid: "",
                tenantName: "",
                officeUuid: "",
                officeName: "",
                departmentUuid: "",
                siteName: "",
                siteDomain: "",
                siteKeyword: "",
                siteDescription: "",
                icpNo: "",
                isComment: true,
                gonganNo: "",
                analysisCode: "",
                createTime: "",
                createBy: "",
                createByName: "",
                updateTime: "",
                updateBy: "",
                updateByName: "",
                siteEnable: true,
            },
            companys: []
        }),

        computed: {
            formTitle() {
                return this.editedIndex === -1 ? this.$t("lang.newitem") : this.$t("lang.edit")
            },
        },

        watch: {
            dialog(val) {
                val || this.close()
            },
        },

        created() {
            this.load_site_list()
            this.load_my_company_list()
        },

        methods: {
            load_site_list() {
                let params = {};
                params.tenantUuid = this.getTenantID();
                params.page = this.options.page;
                params.rows = this.options.itemsPerPage;
                getSiteList(params).then(res => {
                    this.desserts = res.data.data;
                    this.serveritemslength = res.data.total;
                    for (var i = 0; i < this.desserts.length; i++) {
                        if (this.desserts[i].menuUuid == null) {
                            this.desserts[i].menuUuid = [];
                        }
                        this.desserts[i].createTime = utils.formatDate(this.desserts[i].createTime);
                        this.desserts[i].updateTime = utils.formatDate(this.desserts[i].updateTime);
                        this.desserts[i].dataScope = this.desserts[i].dataScope.toString();
                    }
                });
            },
            changecompanylist(any) {
                // 选择了公司以后加载部门列表
                let params = {};
                params.tenantUuid = this.getTenantID();
                params.companyUuid = any;
                getDepartmentSimpleList(params).then(res => {
                    this.department = res.data;
                });
            },
            load_my_company_list() {
                let params = {};
                params.tenantUuid = this.getTenantID();
                getCompanySimpleList(params).then(res => {
                    this.companys = res.data;
                });
            },

            editItem(item) {
                this.editedIndex = this.desserts.indexOf(item)
                this.site = Object.assign({}, item)
                this.selection = this.site.menuVos;
                this.dialog = true
            },

            deleteItem(item) {
                let index = Object.assign({}, item)
                let params = {};
                params.uuid = index.uuid;
                console.warn(index)
                confirm('确定删除吗？') && deleteSite(params).then(res => {
                    this.load_site_list()
                });
            },

            close() {
                this.dialog = false
                this.$nextTick(() => {
                    this.site = Object.assign({}, this.defaultItem)
                    this.selection = [];
                    this.editedIndex = -1
                })
            },

            save() {
                this.site.tenantUuid = this.getTenantID();
                if (this.editedIndex > -1) {
                    // 修改
                    updateSite(this.site).then(res => {
                        if (res.code === 200) {
                            this.load_site_list()
                            this.close()
                        } else {
                            this.$message(this.$t("lang.error") + res.message, "error");
                            return;
                        }
                    });
                } else {
                    // 添加
                    addSite(this.site).then(res => {
                        if (res.code === 200) {
                            this.load_site_list()
                            this.close()
                        } else {
                            this.$message(this.$t("lang.error") + res.message, "error");
                            return;
                        }
                    });
                }
            },
        },
    }
</script>