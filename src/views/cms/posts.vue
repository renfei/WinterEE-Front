<template>
    <v-container class="fill-height" :fluid=true style="align-items: normal;">
        <v-data-table
                :headers="headers"
                :items="postsList"
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
                    <v-toolbar-title>{{$t("lang.postsmanagement")}}</v-toolbar-title>
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>
                    <v-row>
                        <v-col cols="12" sm="6" md="3">
                            <v-select
                                    label="站点"
                                    v-model="CmsPostSearchCriteriaVO.siteUuid"
                                    :items="desserts"
                                    @change="changesite"
                                    item-value="uuid"
                                    item-text="siteName"
                                    dense
                                    outlined
                                    hide-details
                            ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-select
                                    label="分类"
                                    v-model="CmsPostSearchCriteriaVO.categoryUuid"
                                    :items="categoryList"
                                    item-value="uuid"
                                    item-text="zhName"
                                    dense
                                    outlined
                                    hide-details
                            ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field
                                    label="关键字"
                                    v-model="CmsPostSearchCriteriaVO.title"
                                    dense
                                    outlined
                                    hide-details
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-btn color="primary" @click="doSelect">查询</v-btn>
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
                                        <v-col cols="12" sm="6" md="9" lg="9" xl="10">
                                            <v-text-field v-model="post.title" label="标题" outlined
                                                          required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="3" lg="3" xl="2">
                                            <v-select
                                                    label="分类"
                                                    v-model="post.categoryUuid"
                                                    :items="categoryList"
                                                    item-value="uuid"
                                                    item-text="zhName"
                                                    outlined
                                                    hide-details
                                            ></v-select>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="3" lg="3" xl="3">
                                            <v-file-input
                                                    v-model="files"
                                                    hide-details
                                                    accept="image/*"
                                                    color="deep-purple accent-4"
                                                    counter
                                                    label="特色图像"
                                                    placeholder="选择文件"
                                                    outlined
                                            >
                                                <template v-slot:selection="{ index, text }">
                                                    <v-chip
                                                            v-if="index < 2"
                                                            color="deep-purple accent-4"
                                                            dark
                                                            label
                                                            small
                                                    >
                                                        {{ text }}
                                                    </v-chip>

                                                    <span
                                                            v-else-if="index === 2"
                                                            class="overline grey--text text--darken-3 mx-2"
                                                    >
        +{{ files.length - 2 }} File(s)
      </span>
                                                </template>
                                            </v-file-input>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="2" lg="2" xl="1">
                                            <v-switch
                                                    hide-details
                                                    v-model="post.isOriginal"
                                                    label="是否原创"
                                            ></v-switch>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="3" lg="3" xl="3">
                                            <v-text-field v-model="post.sourceName" label="原文作者" outlined hide-details
                                                          required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4" lg="4" xl="5">
                                            <v-text-field v-model="post.sourceUrl" label="原文链接" outlined hide-details
                                                          required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="8" lg="8" xl="9">
                                            <v-text-field v-model="post.describes" label="简介" outlined
                                                          required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4" lg="4" xl="3">
                                            <v-text-field v-model="post.keyword" label="关键字" outlined
                                                          required></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <vue-neditor-wrap v-model="post.content" :config="myConfig"
                                                              :destroy="false"></vue-neditor-wrap>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-select
                                                    v-model="post.tagIds"
                                                    :items="tags"
                                                    item-text="zhName"
                                                    item-value="uuid"
                                                    label="标签"
                                                    multiple
                                            >
                                                <template v-slot:selection="{ item, index }">
                                                    <v-chip v-if="index === 0">
                                                        <span>{{ item.zhName }}</span>
                                                    </v-chip>
                                                    <span
                                                            v-if="index === 1"
                                                            class="grey--text caption"
                                                    >(+{{ value.length - 1 }} others)</span>
                                                </template>
                                            </v-select>
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
        getPostsList,
        getCategoryList,
        getSiteList,
        getTagList,
        addPosts,
        updatePosts,
        deletePosts,
        uploadPublicFile,
    } from '../../api/index'
    import utils from "../../libs/utils";
    import VueNeditorWrap from 'vue-neditor-wrap';

    export default {
        inject: ['getTenantID'],
        data: () => ({
            files: [],
            tags: [],
            myConfig: {
                // 如果需要上传功能,找后端小伙伴要服务器接口地址
                serverUrl: '/api/core/uploadPublicFile',
                // 你的UEditor资源存放的路径,相对于打包后的index.html
                UEDITOR_HOME_URL: '/static/neditor/',
                // 编辑器自动被内容撑高
                autoHeightEnabled: true,
                // 初始容器高度
                initialFrameHeight: 240,
                // 初始容器宽度
                initialFrameWidth: '100%',
                // 关闭自动保存
                enableAutoSave: false
            },
            options: {
                page: 1,
                itemsPerPage: 10,
                pageStart: 1,
                pageStop: 1,
                sortDesc: [false, false]
            },
            CmsPostSearchCriteriaVO: {
                siteUuid: "",
                categoryUuid: "",
                title: "",
                pages: 1,
                rows: 10,
            },
            serveritemslength: 0,
            siteid: "",
            dialog: false,
            headers: [
                {text: "标题", value: 'title'},
                {text: '浏览量', value: 'views'},
                {text: '发布时间', value: 'releaseTime'},
                {text: '添加时间', value: 'createTime'},
                {text: 'Actions', value: 'actions', sortable: false},
            ],
            desserts: [],
            postsList: [],
            categoryList: [],
            selectionType: "independent",
            selection: [],
            editedIndex: -1,
            post: {
                uuid: "",
                siteUuid: "",
                categoryUuid: "",
                isOriginal: true,
                releaseTime: "",
                isComment: true,
                featuredImage: "",
                title: "",
                content: "",
                sourceUrl: "",
                sourceName: "",
                describes: "",
                keyword: "",
                tagIds: [],
            },
            defaultItem: {
                uuid: "",
                siteUuid: "",
                categoryUuid: "",
                isOriginal: true,
                releaseTime: "",
                isComment: true,
                featuredImage: "",
                title: "",
                content: "",
                sourceUrl: "",
                sourceName: "",
                describes: "",
                keyword: "",
                tagIds: [],
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

        components: {
            VueNeditorWrap
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

            load_tag_list(){
                let params = {};
                params.siteUuid = this.siteid;
                params.pages = 1;
                params.rows = 999999;
                getTagList(params).then(res => {
                    if(res.code === 200){
                        this.tags = res.data.data;
                    }else {
                        this.$message(this.$t("lang.error") + res.message, "error");
                    }
                });
            },

            changesite(site) {
                this.siteid = site;
                this.CmsPostSearchCriteriaVO.siteUuid = site;
                let params = {};
                params.siteUuid = site;
                getCategoryList(params).then(res => {
                    this.categoryList = res.data;
                    this.load_tag_list()
                });
            },

            editItem(item) {
                this.files = [];
                this.load_tag_list()
                this.editedIndex = this.postsList.indexOf(item)
                this.post = Object.assign({}, item)
                this.dialog = true
            },

            doSelect() {
                if (this.CmsPostSearchCriteriaVO.siteUuid === "") {
                    this.$message("请先选择站点", "error");
                    return;
                }
                this.CmsPostSearchCriteriaVO.pages = this.options.page;
                this.CmsPostSearchCriteriaVO.rows = this.options.itemsPerPage;
                getPostsList(this.CmsPostSearchCriteriaVO).then(res => {
                    if (res.code === 200) {
                        this.postsList = res.data.data;
                        this.serveritemslength = res.data.total;
                    } else {
                        this.$message(this.$t("lang.error") + res.message, "error");
                    }
                });
            },

            deleteItem(item) {
                let index = Object.assign({}, item)
                let params = {};
                params.uuid = index.uuid;
                confirm('确定删除吗？') && deletePosts(params).then(res => {
                    this.doSelect();
                });
            },

            close() {
                this.files = [];
                this.dialog = false
                this.$nextTick(() => {
                    this.post = Object.assign({}, this.defaultItem)
                    this.selection = [];
                    this.editedIndex = -1
                })
            },

            save() {
                if (this.siteid === "") {
                    this.$message("请先选择站点", "error");
                    return;
                }
                if (this.post.title === "") {
                    this.$message("文章标题不能为空", "error");
                    return;
                }
                if (this.post.categoryUuid === "") {
                    this.$message("文章类别不能为空", "error");
                    return;
                }
                if (this.files !== [] && this.files.length > 0) {
                    var formData = new window.FormData();
                    formData.append('file', this.files);
                    uploadPublicFile(formData).then(res => {
                        if(res.code === 200){
                            this.post.featuredImage = res.data;
                            this.addpost();
                        }else {
                            this.$message(this.$t("lang.error") + res.message, "error");
                            return;
                        }
                    });
                }else {
                    this.addpost();
                }
            },
            addpost(){
                if (this.editedIndex > -1) {
                    // 修改
                    updatePosts(this.post).then(res => {
                        if (res.code === 200) {
                            this.doSelect();
                            this.close()
                        } else {
                            this.$message(this.$t("lang.error") + res.message, "error");
                            return;
                        }
                    });
                } else {
                    // 添加
                    this.post.siteUuid = this.siteid;
                    addPosts(this.post).then(res => {
                        if (res.code === 200) {
                            this.doSelect();
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