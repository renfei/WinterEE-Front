<template>
    <v-container class="fill-height settingMenu" :fluid=true style="align-items: normal;">
        <v-data-table
                :headers="headers"
                :items="desserts"
                :items-per-page="options.rows"
                :page="options.page"
                :options.sync="options"
                item-key="uuid"
                :server-items-length="serveritemslength"
                @update:options="optionsChanged"
                class="elevation-1"
                show-expand
                single-expand=false
                style="width: 100%"
        >
            <template v-slot:top>
                <v-card color="grey lighten-4" flat>
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>系统日志</v-toolbar-title>
                        <v-toolbar-items>
                            <div style="width: 20px;"></div>
                            <v-row align="center">
                                <v-col>
                                    <v-select
                                            :items="logTypes"
                                            label="日志类型"
                                            item-value="value"
                                            item-text="text"
                                            :dense="true"
                                            v-model="query_params.logType"
                                            outlined
                                    ></v-select>
                                </v-col>
                                <v-col>
                                    <v-select
                                            :items="logSubTypes"
                                            label="日志子类"
                                            item-value="value"
                                            item-text="text"
                                            v-model="query_params.subType"
                                            :dense="true"
                                            outlined
                                    ></v-select>
                                </v-col>
                                <v-col>
                                    <v-menu
                                            v-model="startmenu"
                                            :close-on-content-click="false"
                                            :nudge-right="40"
                                            transition="scale-transition"
                                            offset-y
                                            min-width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                    v-model="query_params.startDate"
                                                    label="开始日期"
                                                    prepend-icon="event"
                                                    readonly
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="query_params.startDate"
                                                       @input="startmenu = false"></v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col>
                                    <v-menu
                                            v-model="endmenu"
                                            :close-on-content-click="false"
                                            :nudge-right="40"
                                            transition="scale-transition"
                                            offset-y
                                            min-width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                    v-model="query_params.endDate"
                                                    label="截止日期"
                                                    prepend-icon="event"
                                                    readonly
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="query_params.endDate"
                                                       @input="endmenu = false"></v-date-picker>
                                    </v-menu>
                                </v-col>
                            </v-row>
                        </v-toolbar-items>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="search">
                            <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                    </v-toolbar>
                </v-card>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                    logValue:{{ item.logValue }} <br/>
                    requestUrl:{{ item.requestUrl }} <br/>
                    requestMethod:{{ item.requestMethod }} <br/>
                    statusCode:{{ item.statusCode }} <br/>
                    requestHead:{{ item.requestHead }} <br/>
                    requestBody:{{ item.requestBody }} <br/>
                    responseHead:{{ item.responseHead }} <br/>
                    responseBody:{{ item.responseBody }} <br/>
                    requestHead:{{ item.requestHead }} <br/>
                    tenantUuid:{{ item.tenantUuid }} <br/>
                </td>
            </template>
            <template v-slot:no-data>
               No Data
            </template>
        </v-data-table>
        <v-overlay
                :absolute="true"
                :value="edit_overlay"
        >
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
    </v-container>
</template>
<script type="text/ecmascript-6">
    import {getSettingLog, getSettingLogTypeList, getSettingLogSubTypeList} from '../api/index';

    export default {
        data(){
            return {
                dialog: false,
                edit_overlay: false,
                serveritemslength: 0,
                options: {
                    page: 1,
                    itemsPerPage: 10,
                    pageStart: 1,
                    pageStop: 1,
                    sortDesc: [false, false]
                },
                query_params: {
                    logType: "ALL",
                    subType: "ALL",
                    startDate: new Date().toISOString().substr(0, 10),
                    endDate: new Date().toISOString().substr(0, 10),
                },
                date: new Date().toISOString().substr(0, 10),
                startmenu: false,
                endmenu: false,
                logTypes: [],
                logSubTypes: [],
                headers: [
                    {text: 'createTime', value: 'createTime', sortable: false},
                    {text: 'logType', sortable: false, value: 'logType'},
                    {text: 'logSubType', value: 'logSubType', sortable: false},
                    {text: 'clientIp', value: 'clientIp', sortable: false},
                    {text: 'clientUuid', value: 'clientUuid', sortable: false},
                    {text: 'logValue', value: 'logValue', sortable: false},
                ],
                desserts: [],
                editedIndex: -1,
                editedItem: {
                    name: '',
                    calories: 0,
                    fat: 0,
                    carbs: 0,
                    protein: 0,
                },
                defaultItem: {
                    name: '',
                    calories: 0,
                    fat: 0,
                    carbs: 0,
                    protein: 0,
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
            this.initialize()
        },

        methods: {
            initialize () {
                this.edit_overlay = true;
                let params = {};
                params.lang = this.getStore('locale');
                getSettingLogTypeList(params).then(res => {
                    this.logTypes = res.data;
                });
                getSettingLogSubTypeList(params).then(res => {
                    this.logSubTypes = res.data;
                });
                this.search();
                this.edit_overlay = false;
            },
            search(){
                let params = this.query_params;
                if (params.startDate.indexOf("00:00:00") == -1) {
                    params.startDate = params.startDate + " 00:00:00";
                }
                if (params.endDate.indexOf("23:59:59") == -1) {
                    params.endDate = params.endDate + " 23:59:59";
                }
                params.page = this.options.page;
                params.rows = this.options.itemsPerPage;
                getSettingLog(params).then(res => {
                    if (res.data.length > 0) {
                        this.serveritemslength = res.data[0].total;
                    }
                    this.desserts = res.data;
                });
            },
            editItem (item) {
                this.editedIndex = this.desserts.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },

            deleteItem (item) {
                const index = this.desserts.indexOf(item)
                confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
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
                    Object.assign(this.desserts[this.editedIndex], this.editedItem)
                } else {
                    this.desserts.push(this.editedItem)
                }
                this.close()
            },
            optionsChanged(){
                this.search();
            },
            translate_log_type(value){
                switch (value) {
                    case "":
                        break;
                    default:
                        return value;
                }
            },
        },
    }
</script>