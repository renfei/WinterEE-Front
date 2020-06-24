<template>
    <v-container class="fill-height" :fluid=true style="align-items: normal;">
        <v-data-table
                :headers="headers"
                :items="desserts"
                :disable-pagination="true"
                :disable-sort="true"
                hide-default-footer
                class="elevation-1"
                style="width: 100%"
        >
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>{{$t("lang.rolemanagement")}}</v-toolbar-title>
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
                                        <v-col cols="12" sm="6" md="6">
                                            <v-row>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="role.name" label="名称" outlined
                                                                  required></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-select v-model="role.officeUuid"
                                                              :items="companys"
                                                              label="公司"
                                                              item-text="name"
                                                              item-value="uuid"
                                                              outlined></v-select>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-radio-group v-model="role.dataScope" label="数据范围" row
                                                                   style="margin-top: 0;">
                                                        <v-radio label="全部（危险）" value="0"></v-radio>
                                                        <v-radio label="本公司以下" value="1"></v-radio>
                                                        <v-radio label="本公司及本部门" value="2"></v-radio>
                                                        <v-radio label="本部门" value="3"></v-radio>
                                                    </v-radio-group>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="12">
                                                    <v-text-field v-model="role.remarks" label="备注" outlined
                                                                  required></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-row>
                                                <v-card class="fill-height" style="width: 100%;">
                                                    <v-card-title>
                                                        <span class="headline">{{$t("lang.menuandauthority")}}</span>
                                                    </v-card-title>
                                                    <v-card-text>
                                                        <v-row>
                                                            <v-col>
                                                                <v-treeview
                                                                        v-model="selection"
                                                                        :items="items"
                                                                        item-key="uuid"
                                                                        item-text="text"
                                                                        :selection-type="selectionType"
                                                                        selectable
                                                                        return-object
                                                                        :open-all="true"
                                                                ></v-treeview>
                                                            </v-col>
                                                            <v-divider vertical></v-divider>
                                                            <v-col class="pa-6" cols="6">
                                                                <template v-if="!selection.length">
                                                                    No nodes selected.
                                                                </template>
                                                                <template v-else>
                                                                    <div v-for="node in selection" :key="node.uuid">
                                                                        {{ node.text }}
                                                                    </div>
                                                                </template>
                                                            </v-col>
                                                        </v-row>
                                                    </v-card-text>
                                                </v-card>
                                            </v-row>
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
        getMenuAndAuthorityTree,
        getRoleList,
        addRole,
        updateRole,
        deleteRole,
        getMyCompanyList
    } from '../../api/index'
    import utils from "../../libs/utils";

    export default {
        inject: ['getTenantID'],
        data: () => ({
            dialog: false,
            headers: [
                {text: "名称", value: 'name'},
                {text: '租户', value: 'tenantName'},
                {text: '公司', value: 'officeName'},
                {text: '创建人', value: 'createByName'},
                {text: '创建时间', value: 'createTime'},
                {text: '修改人', value: 'updateByName'},
                {text: '修改时间', value: 'updateTime'},
                {text: '备注', value: 'remarks'},
                {text: 'Actions', value: 'actions', sortable: false},
            ],
            desserts: [],
            selectionType: "independent",
            selection: [],
            editedIndex: -1,
            role: {
                id: "",
                uuid: "",
                tenantUuid: "",
                tenantName: "",
                officeUuid: "",
                officeName: "",
                name: "",
                enname: "",
                roleType: "",
                dataScope: "1",
                useable: true,
                createBy: "",
                createByName: "",
                createTime: "",
                updateBy: "",
                updateByName: "",
                updateTime: "",
                remarks: "",
                delFlag: "0",
                menuUuid: [],
                menuVos:[]
            },
            defaultItem: {
                id: "",
                uuid: "",
                tenantUuid: "",
                tenantName: "",
                officeUuid: "",
                officeName: "",
                name: "",
                enname: "",
                roleType: "",
                dataScope: "1",
                useable: true,
                createBy: "",
                createTime: "",
                updateBy: "",
                updateTime: "",
                remarks: "",
                delFlag: "0",
                menuUuid: [],
                menuVos:[]
            },
            items: [],
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
            this.load_role_list()
            this.load_menu()
            this.load_my_company_list()
        },

        methods: {
            load_role_list() {
                let params = {};
                params.tenantUuid = this.getTenantID();
                getRoleList(params).then(res => {
                    this.desserts = res.data;
                    for (var i = 0; i < this.desserts.length; i++) {
                        if(this.desserts[i].menuUuid ==null){
                            this.desserts[i].menuUuid = [];
                        }
                        this.desserts[i].createTime = utils.formatDate(this.desserts[i].createTime);
                        this.desserts[i].updateTime = utils.formatDate(this.desserts[i].updateTime);
                        this.desserts[i].dataScope = this.desserts[i].dataScope.toString();
                    }
                });
            },
            load_menu() {
                let params = {
                    tenant: this.getTenantID(),
                    language: this.getStore('locale')
                };
                getMenuAndAuthorityTree(params).then(res => {
                    this.items = res.data;
                });
            },
            load_my_company_list() {
                let params = {
                    tenantUuid: this.getTenantID(),
                    language: this.getStore('locale')
                };
                getMyCompanyList(params).then(res => {
                    this.companys = res.data;
                });
            },

            editItem(item) {
                this.editedIndex = this.desserts.indexOf(item)
                this.role = Object.assign({}, item)
                this.selection = this.role.menuVos;
                this.dialog = true
            },

            deleteItem(item) {
                let index = Object.assign({}, item)
                let params = {};
                params.uuid = index.uuid;
                console.warn(index)
                confirm('确定删除吗？') && deleteRole(params).then(res=>{this.load_role_list()});
            },

            close() {
                this.dialog = false
                this.$nextTick(() => {
                    this.role = Object.assign({}, this.defaultItem)
                    this.selection = [];
                    this.editedIndex = -1
                })
            },

            save() {
                this.role.menuUuid = [];
                for (var i = 0; i < this.selection.length; i++) {
                    this.role.menuUuid.push(this.selection[i].uuid);
                }
                this.role.tenantUuid = this.getTenantID();
                if (this.editedIndex > -1) {
                    // 修改
                    updateRole(this.role).then(res => {
                        if(res.code===200){
                            this.load_role_list()
                        }
                    });
                } else {
                    // 添加
                    addRole(this.role).then(res => {
                        if(res.code===200){
                            this.load_role_list()
                        }
                    });
                }
                this.close()
            },
        },
    }
</script>