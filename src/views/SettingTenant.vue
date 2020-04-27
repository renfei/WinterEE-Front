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
                        <v-toolbar-title>租户管理</v-toolbar-title>
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
                                                <v-text-field v-model="editedItem.name"
                                                              label="名称"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem.expiryDate"
                                                              label="过期时间"></v-text-field>
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
            </template>
            <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">Reset</v-btn>
            </template>
        </v-data-table>
    </v-container>
</template>
<script type="text/ecmascript-6">
    import {getSettingTeantList, addSettingTeantList, updateSettingTeantList} from '../api/index'

    export default {
        data(){
            return {
                dialog: false,
                serveritemslength:0,
                options: {
                    page: 1,
                    itemsPerPage: 10,
                    pageStart: 1,
                    pageStop: 1,
                    sortDesc: [false, false]
                },
                headers: [
                    {
                        text: '名称',
                        align: 'start',
                        sortable: false,
                        value: 'name',
                    },
                    {text: '添加时间', value: 'createTime', sortable: false},
                    {text: '过期时间', value: 'expiryDate', sortable: false},
                    {text: '状态', value: 'status', sortable: false},
                    {text: 'UUID', value: 'uuid', sortable: false},
                    {text: 'Actions', value: 'actions', sortable: false},
                ],
                desserts: [],
                editedIndex: -1,
                editedItem: {
                    createTime: "",
                    expiryDate: "",
                    id: 1,
                    name: "",
                    status: 1,
                    updateTime: null,
                    uuid: ""
                },
                defaultItem: {
                    createTime: "",
                    expiryDate: "",
                    id: 1,
                    name: "",
                    status: 1,
                    updateTime: null,
                    uuid: ""
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
                getSettingTeantList(params).then(res => {
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
                    updateSettingTeantList(this.editedItem).then(res => {
                        this.initialize();
                        this.close()
                    });

                } else {
                    // 添加
                    addSettingTeantList(this.editedItem).then(res => {
                        this.initialize();
                        this.close()
                    });
                }
                this.initialize();
            },
        },
    }
</script>