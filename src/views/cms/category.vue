<template>
    <v-container class="fill-height" :fluid=true style="align-items: normal;">
        <v-data-table
                :headers="headers"
                :items="categoryList"
                hide-default-footer
                item-key="uuid"
                class="elevation-1"
                style="width: 100%"
        >
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>{{$t("lang.categorymanagement")}}</v-toolbar-title>
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>
                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                            <v-select
                                    label="站点"
                                    :items="desserts"
                                    @change="changesite"
                                    item-value="uuid"
                                    item-text="siteName"
                                    dense
                                    outlined
                                    hide-details
                            ></v-select>
                        </v-col>
                    </v-row>
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
                                            <v-text-field v-model="site.zhName" label="中文名称" outlined
                                                          required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="site.enName" label="英文名称" outlined
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
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryList,
    } from '../../api/index'
    import utils from "../../libs/utils";

    export default {
        inject: ['getTenantID'],
        data: () => ({
            siteid: "",
            dialog: false,
            headers: [
                {text: "中文名称", value: 'zhName'},
                {text: '英文名称', value: 'enName'},
                {text: 'Actions', value: 'actions', sortable: false},
            ],
            desserts: [],
            categoryList: [],
            selectionType: "independent",
            selection: [],
            editedIndex: -1,
            site: {
                siteUuid: "",
                enName: "",
                zhName: "",
                uuid: "",
            },
            defaultItem: {
                siteUuid: "",
                enName: "",
                zhName: "",
                uuid: "",
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
        },

        methods: {
            load_site_list() {
                let params = {};
                params.tenantUuid = this.getTenantID();
                params.page = 1;
                params.rows = 9999;
                getSiteList(params).then(res => {
                    this.desserts = res.data.data;
                    // this.serveritemslength = res.data.total;
                });
            },

            changesite(site) {
                this.siteid = site;
                let params = {};
                params.siteUuid = site;
                getCategoryList(params).then(res => {
                    this.categoryList = res.data;
                });
            },

            editItem(item) {
                this.editedIndex = this.categoryList.indexOf(item)
                this.site = Object.assign({}, item)
                this.selection = this.site.menuVos;
                this.dialog = true
            },

            deleteItem(item) {
                let index = Object.assign({}, item)
                let params = {};
                params.cmsCategoryUuid = index.uuid;
                confirm('确定删除吗？') && deleteCategory(params).then(res => {
                    this.changesite(this.siteid);
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
                if(this.siteid === ""){
                    this.$message("请先选择站点", "error");
                    return;
                }
                if(this.site.enName === ""){
                    this.$message("英文名称不能为空", "error");
                    return;
                }
                if(this.site.zhName === ""){
                    this.$message("中文名称不能为空", "error");
                    return;
                }
                if (this.editedIndex > -1) {
                    // 修改
                    updateCategory(this.site).then(res => {
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
                    this.site.siteUuid = this.siteid;
                    addCategory(this.site).then(res => {
                        if (res.code === 200) {
                            this.load_site_list()
                            this.close()
                        } else {
                            this.$message(this.$t("lang.error") + res.message, "error");
                            return;
                        }
                    });
                }
                this.changesite(this.siteid);
            },
        },
    }
</script>