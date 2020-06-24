<template>
    <v-container fluid class="fill-height" style="align-items: normal;">
        <v-row>
            <v-col xs="12" sm="3" md="2" lg="2">
                <v-card class="mx-auto" style="min-height: 100%;">
                    <v-app-bar
                            dark
                            color="blue darken-3"
                    >
                        <v-toolbar-title>{{ $t("lang.organization")}}</v-toolbar-title>
                    </v-app-bar>
                    <v-card-text>
                        <v-treeview
                                item-text="name"
                                item-key="uuid"
                                hoverable
                                dense
                                :open-all="true"
                                :items="organizationList"
                        >
                            <template slot="label" slot-scope="{ item }">
                                <a @click="clickOrganizationList(item)">{{ item.name }}</a>
                            </template>
                        </v-treeview>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col xs="12" sm="9" md="10" lg="10">
                <v-row>
                    <v-col cols="12" sm="3" md="2">
                        <v-text-field v-model="accountSearchCriteria.accountUuid" dense outlined
                                      label="UUID"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" md="2">
                        <v-text-field v-model="accountSearchCriteria.userName" dense outlined
                                      :label="this.$t('lang.username')"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" md="2">
                        <v-text-field v-model="accountSearchCriteria.phone" dense outlined
                                      :label="this.$t('lang.telephone')"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" md="2">
                        <v-text-field v-model="accountSearchCriteria.email" dense outlined
                                      :label="this.$t('lang.email')"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" md="2">
                        <v-btn color="primary" @click="query">{{$t("lang.query")}}</v-btn>
                    </v-col>
                </v-row>
                <v-data-table
                        :headers="headers"
                        :items="desserts"
                        :items-per-page="options.itemsPerPage"
                        :page="options.page"
                        :options.sync="options"
                        :server-items-length="serveritemslength"
                        @update:options="query"
                        sort-by="calories"
                        class="elevation-1"
                >
                    <template v-slot:top>
                        <v-toolbar flat color="white">
                            <v-toolbar-title>{{$t("lang.account")}}</v-toolbar-title>
                            <v-divider
                                    class="mx-4"
                                    inset
                                    vertical
                            ></v-divider>
                            <v-spacer></v-spacer>
                            <v-dialog v-model="dialog" max-width="90%">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                            color="primary"
                                            dark
                                            class="mb-2"
                                            v-bind="attrs"
                                            v-on="on"
                                    >{{$t("lang.newitem")}}
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
                                                    <v-text-field v-model="editedItem.uuid" outlined readonly
                                                                  label="UUID"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="editedItem.userName" outlined
                                                                  label="用户名"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-select
                                                            item-text="name"
                                                            item-value="uuid"
                                                            v-model="editedItem.officeUuid"
                                                            :items="companylist"
                                                            label="所属公司"
                                                            @change="changecompanylist"
                                                            outlined
                                                    ></v-select>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-select
                                                            item-text="name"
                                                            item-value="uuid"
                                                            v-model="editedItem.departmentUuid"
                                                            :items="departmentlist"
                                                            label="所属部门"
                                                            outlined
                                                    ></v-select>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="editedItem.phone" outlined
                                                                  label="联系电话"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="editedItem.email" outlined
                                                                  label="电子邮箱"></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-card style="width: 100%;">
                                                    <v-toolbar
                                                            color="primary"
                                                            dark
                                                            flat
                                                    >
                                                        <v-toolbar-title>{{$t("lang.rolemanagement")}}</v-toolbar-title>
                                                    </v-toolbar>

                                                    <v-row>
                                                        <v-col>
                                                            <v-card-text>
                                                                <v-treeview
                                                                        v-model="tree"
                                                                        :items="rolelist"
                                                                        selected-color="indigo"
                                                                        selectable
                                                                        return-object
                                                                        expand-icon="mdi-chevron-down"
                                                                >
                                                                </v-treeview>
                                                            </v-card-text>
                                                        </v-col>

                                                        <v-divider vertical></v-divider>

                                                        <v-col
                                                                cols="12"
                                                                md="6"
                                                        >
                                                            <v-card-text>
                                                                <div
                                                                        v-if="tree.length === 0"
                                                                        key="title"
                                                                        class="title font-weight-light grey--text pa-4 text-center"
                                                                >
                                                                    {{$t("lang.selectuserrole")}}
                                                                </div>

                                                                <v-scroll-x-transition
                                                                        group
                                                                        hide-on-leave
                                                                >
                                                                    <v-chip
                                                                            v-for="(selection, i) in tree"
                                                                            :key="i"
                                                                            color="grey"
                                                                            dark
                                                                            small
                                                                            class="ma-1"
                                                                    >
                                                                        <v-icon left small>mdi-beer</v-icon>
                                                                        {{ selection.name }}
                                                                    </v-chip>
                                                                </v-scroll-x-transition>
                                                            </v-card-text>
                                                        </v-col>
                                                    </v-row>
                                                </v-card>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                                        <v-btn color="blue darken-1" text @click="save">Save</v-btn>
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
                                @click="resetpassword(item)"
                        >
                            mdi-lock-reset
                        </v-icon>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
        <v-dialog v-model="resetpassworddialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">密码重置</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field v-model="resetpasswordobj.accountName" outlined readonly
                                              label="账户"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field v-model="resetpasswordobj.newPassword" outlined type="password"
                                              label="新密码"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field v-model="resetpasswordobj.newPasswords" outlined type="password"
                                              label="重复新密码"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="resetpasswordclose">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="resetpasswordsave">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import {
        getAllOrganizationTree,
        getAccountList,
        getRoleList,
        getCompanySimpleList,
        getDepartmentSimpleList,
        addAccount,
        updateAccount,
        resetPassword, signIn,
    } from '../../api/index'
    import encryption from "../../libs/encryption";

    export default {
        inject: ['getTenantID'],
        data() {
            return {
                usernamereadonly: true,
                organizationList: [],
                serveritemslength: 0,
                dialog: false,
                resetpassworddialog: false,
                headers: [
                    {
                        text: 'UUID',
                        value: 'uuid',
                    },
                    {text: this.$t('lang.username'), value: 'userName'},
                    {text: this.$t('lang.companyname'), value: 'officeName'},
                    {text: this.$t('lang.departmentname'), value: 'departmentName'},
                    {text: this.$t('lang.email'), value: 'email'},
                    {text: this.$t('lang.telephone'), value: 'phone'},
                    {text: 'Actions', value: 'actions', sortable: false},
                ],
                desserts: [],
                editedIndex: -1,
                editedItem: {
                    uuid: "",
                    userName: "",
                    officeUuid: "",
                    departmentUuid: "",
                    email: "",
                    phone: "",
                    roles: [],
                },
                defaultItem: {
                    uuid: "",
                    userName: "",
                    officeUuid: "",
                    departmentUuid: "",
                    email: "",
                    phone: "",
                    roles: [],
                },
                accountSearchCriteria: {
                    tenantuuid: "",
                    orgUuid: "",
                    orgType: "",
                    accountUuid: "",
                    userName: "",
                    phone: "",
                    email: "",
                    pages: 1,
                    rows: 10,
                },
                options: {
                    page: 1,
                    itemsPerPage: 10,
                    pageStart: 1,
                    pageStop: 1,
                    sortDesc: [false, false]
                },
                rolelist: [],
                companylist: [],
                departmentlist: [],
                breweries: [],
                isLoading: false,
                tree: [],
                types: [],
                resetpasswordobj: {
                    accountName: "",
                    accountUuid: "",
                    newPassword: "",
                    newPasswords: "",
                    language: "",
                    keyid: "",
                },
            }
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
            },
        },

        watch: {
            dialog(val) {
                val || this.close()
            },
            breweries(val) {
                this.types = val.reduce((acc, cur) => {
                    const type = cur.brewery_type

                    if (!acc.includes(type)) acc.push(type)

                    return acc
                }, []).sort()
            },
        },
        created() {
            this.load_organization_tree();
            this.load_role_list();
            this.initialize()
        },
        methods: {
            load_organization_tree() {
                let params = {};
                params.tenantUuid = this.getTenantID();
                getAllOrganizationTree(params).then(res => {
                    this.organizationList = res.data;
                });
            },
            load_role_list() {
                let params = {};
                params.tenantUuid = this.getTenantID();
                getRoleList(params).then(res => {
                    this.rolelist = res.data;
                });
                getCompanySimpleList(params).then(res => {
                    this.companylist = res.data;
                });
            },
            clickOrganizationList(item) {
                this.accountSearchCriteria = {
                    tenantuuid: "",
                    orgUuid: "",
                    orgType: "",
                    accountUuid: "",
                    userName: "",
                    phone: "",
                    email: "",
                    pages: 1,
                    rows: 10,
                };
                if (item.isTenant) {
                    this.accountSearchCriteria.orgType = "";
                    this.accountSearchCriteria.orgUuid = "";
                } else {
                    this.accountSearchCriteria.orgType = item.orgType;
                    this.accountSearchCriteria.orgUuid = item.uuid;
                }
                this.query();
            },
            query() {
                this.accountSearchCriteria.tenantuuid = this.getTenantID();
                this.accountSearchCriteria.pages = this.options.page;
                this.accountSearchCriteria.rows = this.options.itemsPerPage;
                getAccountList(this.accountSearchCriteria).then(res => {
                    this.desserts = res.data.data;
                    this.serveritemslength = res.data.total;
                });
            },
            initialize() {
                this.query();
            },
            changecompanylist(any) {
                // 选择了公司以后加载部门列表
                let params = {};
                params.tenantUuid = this.getTenantID();
                params.companyUuid = any;
                getDepartmentSimpleList(params).then(res => {
                    this.departmentlist = res.data;
                });
            },
            editItem(item) {
                this.editedIndex = this.desserts.indexOf(item)
                this.editedItem = Object.assign({}, item)
                if (this.editedItem.uuid === "") {
                    this.usernamereadonly = false;
                }
                this.tree = [];
                for (let i = 0; i < this.rolelist.length; i++) {
                    for (let j = 0; j < item.roles.length; j++) {
                        if (this.rolelist[i].uuid === item.roles[j]) {
                            this.tree.push(this.rolelist[i]);
                        }
                    }
                }
                this.dialog = true
            },
            resetpassword(item) {
                console.warn(item)
                this.resetpasswordobj.accountName = item.userName;
                this.resetpasswordobj.accountUuid = item.uuid;
                this.resetpassworddialog = true;
            },
            close() {
                this.dialog = false
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                    this.usernamereadonly = true;
                })
            },
            save() {
                this.editedItem.tenantUuid = this.getTenantID();
                for (let i = 0; i < this.tree.length; i++) {
                    this.editedItem.roles.push(this.tree[i].uuid);
                }
                if (this.editedIndex > -1) {
                    // 修改
                    updateAccount(this.editedItem).then(res => {
                        this.initialize()
                        this.close();
                    });
                } else {
                    // 添加
                    addAccount(this.editedItem).then(res => {
                        this.initialize()
                        this.close()
                    });
                }
            },
            resetpasswordsave() {
                if (this.resetpasswordobj.newPassword !== "" &&
                    this.resetpasswordobj.newPassword === this.resetpasswordobj.newPasswords) {
                    // 加密密码传输
                    encryption.aesEncrypt(this.password).then(val => {
                        //登陆
                        this.resetpasswordobj.newPassword = val.content;
                        this.resetpasswordobj.keyid = val.KeyId;
                        resetPassword(this.resetpasswordobj).then(res=>{
                            if(res.code===200){
                                this.resetpassworddialog = false;
                            }else {
                                this.$message(this.$t("lang.error") + res.message, "error");
                            }
                        });
                    });
                } else {
                    this.$message(this.$t("lang.error") + " 新密码不一致", "error");
                }
            },
            resetpasswordclose() {
                this.resetpassworddialog = false;
            },
        },
    }
</script>

<style scoped>

</style>