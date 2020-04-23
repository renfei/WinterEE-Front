<template>
    <v-app id="Main">
        <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
            <v-toolbar-title style="width: 200px" class="ml-0 pl-4">
                <span class="hidden-sm-and-down">{{$t("lang.dashboard")}}</span>
            </v-toolbar-title>
            <v-spacer/>
            <v-row align="center" style="max-width: 150px">
                <v-col>
                    <v-select :items="lang_items" v-model="this.$i18n.locale" @change="lang_change" :dense="true" hide-details outlined></v-select>
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
                            <v-list-item-content>
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
                            <v-list-item-content @click="menu_click('aa')">
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
                        <v-list-item-action @click="menu_click('aa')">
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-action>
                        <v-list-item-content @click="menu_click('aa')">
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
                <router-view></router-view>
            </v-container>
        </v-content>
    </v-app>
</template>
<script>
    import {getMenuTree} from './api/index'
    import locale from './libs/locale'

    export default {
        name: 'main',
        props: {
            source: String,
        },
        data: () => ({
            locale:"",
            lang_items: locale.list(),
            tenants: ['Foo', 'Bar', 'Fizz', 'Buzz'],
            dialog: false,
            drawer: null,
            items: [],
        }),
        created(){
            this.load_menu();
        },
        methods: {
            load_menu(){
                let params = {
                    language: this.getStore('locale')
                };
                getMenuTree(params).then(res => {
                    this.items=res.data;
                });
            },
            lang_change(any){
                locale.setLocale(any);
                this.$i18n.locale = this.getStore('locale');
                this.load_menu();
            },
            menu_click(value){
                alert(value);
            }
        }
    }
</script>
