<template>
    <v-container class="fill-height settingMenu" :fluid=true style="align-items: normal;">
        <v-data-table
                :headers="headers"
                :items="desserts"
                :items-per-page="options.rows"
                :page="options.page"
                :options.sync="options"
                item-key="uuid"
                class="elevation-1"
                style="width: 100%"
        >
            <template v-slot:top>
                <v-card color="grey lighten-4" flat>
                    <v-toolbar dark color="primary">
                        <v-icon>mdi-account-group-outline</v-icon>
                        <v-toolbar-title>OAuth客户端管理</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="500px">
                            <template v-slot:activator="{ on }">
                                <v-btn icon v-on="on">
                                    <v-icon>mdi-plus</v-icon>
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
                                                <v-text-field v-model="editedItem.clientId"
                                                              label="clientId"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem.resourceIds"
                                                              label="resourceIds"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem.scope"
                                                              label="scope"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem.authorizedGrantTypes"
                                                              label="authorizedGrantTypes"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem.webServerRedirectUri"
                                                              label="webServerRedirectUri"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem.authorities"
                                                              label="authorities"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem.accessTokenValidity"
                                                              label="accessTokenValidity"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem.refreshTokenValidity"
                                                              label="refreshTokenValidity"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem.archived"
                                                              label="archived"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem.trusted"
                                                              label="trusted"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem.autoapprove"
                                                              label="autoapprove"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem.additionalInformation"
                                                              label="additionalInformation"></v-text-field>
                                            </v-col>
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
                        <v-dialog v-model="secretdialog" max-width="500px">
                            <v-card>
                                <v-card-text>
                                    <v-container>
                                        <v-alert type="warning">
                                            {{$t("lang.secretisonlydisplayedoncepleasesave")}}
                                        </v-alert>
                                        <v-alert type="info">
                                            Secret: {{ Secret }}
                                        </v-alert>
                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="secretdialog = false">OK</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </v-card>
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
            <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">Reset</v-btn>
            </template>
        </v-data-table>
    </v-container>
</template>
<script type="text/ecmascript-6">
    import {
        getSettingOAuthClientList,
        addSettingOAuthClient,
        updateSettingOAuthClient,
        deleteSettingOAuthClient
    } from '../api/index'

    export default {
        data(){
            return {
                dialog: false,
                secretdialog: false,
                Secret: "",
                serveritemslength: 0,
                options: {
                    page: 1,
                    itemsPerPage: 10,
                    pageStart: 1,
                    pageStop: 1,
                    sortDesc: [false, false]
                },
                headers: [
                    {text: 'clientId', sortable: false, value: 'clientId',},
                    {text: 'resourceIds', value: 'resourceIds', sortable: false},
                    {text: 'scope', value: 'scope', sortable: false},
                    {text: 'authorizedGrantTypes', value: 'authorizedGrantTypes', sortable: false},
                    {text: 'webServerRedirectUri', value: 'webServerRedirectUri', sortable: false},
                    {text: 'authorities', value: 'authorities', sortable: false},
                    {text: 'accessTokenValidity', value: 'accessTokenValidity', sortable: false},
                    {text: 'refreshTokenValidity', value: 'refreshTokenValidity', sortable: false},
                    {text: 'createTime', value: 'createTime', sortable: false},
                    {text: 'archived', value: 'archived', sortable: false},
                    {text: 'trusted', value: 'trusted', sortable: false},
                    {text: 'autoapprove', value: 'autoapprove', sortable: false},
                    {text: 'additionalInformation', value: 'additionalInformation', sortable: false},
                    {text: 'Actions', value: 'actions', sortable: false},
                ],
                desserts: [],
                editedIndex: -1,
                editedItem: {
                    accessTokenValidity: 7200,
                    additionalInformation: null,
                    archived: 0,
                    authorities: null,
                    authorizedGrantTypes: "auto_password,refresh_token,verification_code",
                    autoapprove: "false",
                    clientId: "",
                    createTime: new Date().toISOString().substr(0, 10) + " " + new Date().toISOString().substr(11, 8),
                    lang: null,
                    refreshTokenValidity: 864000,
                    resourceIds: "",
                    scope: "",
                    trusted: 0
                },
                defaultItem: {
                    accessTokenValidity: 7200,
                    additionalInformation: null,
                    archived: 0,
                    authorities: null,
                    authorizedGrantTypes: "auto_password,refresh_token,verification_code",
                    autoapprove: "false",
                    clientId: "",
                    createTime: new Date().toISOString().substr(0, 10) + " " + new Date().toISOString().substr(11, 8),
                    lang: null,
                    refreshTokenValidity: 864000,
                    resourceIds: "",
                    scope: "",
                    trusted: 0
                },
            }
        },
        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
            },
        },

        watch: {
            dialog (val) {
                val || this.close()
            },
        },

        created () {
            this.initialize();
        },

        methods: {
            initialize () {
                let params = {};
                params.page = this.options.page;
                params.rows = this.options.itemsPerPage;
                getSettingOAuthClientList(params).then(res => {
                    this.serveritemslength = res.data.total;
                    this.desserts = res.data.data;
                });
            },

            editItem (item) {
                this.editedIndex = this.desserts.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },

            close () {
                this.dialog = false
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                }, 300)
            },

            save () {
                if (this.editedIndex > -1) {
                    // 更新
                    updateSettingOAuthClient(this.editedItem).then(res => {
                        if (res.code === 200) {
                            this.initialize();
                            this.close()
                        } else {
                            this.$message(res.message, "error");
                        }
                    });

                } else {
                    // 添加
                    addSettingOAuthClient(this.editedItem).then(res => {
                        if (res.code === 200) {
                            this.Secret = res.data;
                            this.secretdialog = true;
                            this.initialize();
                            this.close()
                        } else {
                            this.$message(res.message, "error");
                        }
                    });
                }
                this.initialize();
            },
            deleteItem (item) {
                const index = this.desserts.indexOf(item);
                if (confirm('Are you sure you want to delete this item? : ' + item.clientId)) {
                    this.dodelete(item);
                }
            },
            dodelete(item){
                let params = {};
                params.clientId = item.clientId;
                deleteSettingOAuthClient(params).then(res => {
                    if (res.code === 200) {
                        this.initialize();
                        this.close()
                    } else {
                        this.$message(res.message, "error");
                    }
                });
            }
        },
    }
</script>