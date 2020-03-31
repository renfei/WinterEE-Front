<template>
    <v-app>
        <v-content>
            <v-container class="fill-height lock_screen" fluid
                         :style="{backgroundImage: 'url(' + require('../assets/lock_screen.jpg') + ')' }">
                <v-overlay :absolute="true" :opacity="0.382" :value="true">
                    <div class="">
                        <v-icon :size="80" dark>lock</v-icon>
                    </div>
                    <div style="font-size: 18px;font-weight: 600;">已锁屏</div>
                    <div id="time">{{ time }}</div>
                    <div id="date">{{ date }}</div>
                    <div class="text-center">
                        <v-dialog
                                v-model="dialog"
                                width="500"
                        >
                            <template v-slot:activator="{ on }">
                                <v-btn
                                        color="blue darken-3"
                                        dark large
                                        v-on="on"
                                >
                                    <v-icon left dark >mdi-lock-open-outline</v-icon>
                                    解 锁
                                </v-btn>
                            </template>

                            <v-card>
                                <v-card-title
                                        class="headline grey lighten-2"
                                        primary-title
                                >
                                    <v-icon right style="margin-right: 10px;">mdi-lock-open-outline</v-icon>
                                    解除锁屏
                                </v-card-title>

                                <v-card-text>
                                    <v-form v-model="valid">
                                        <v-container>
                                            <v-row>
                                                <v-col cols="12" md="12">
                                                    <v-text-field
                                                            label="登陆密码"
                                                            prepend-icon="mdi-shield-key"
                                                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                                            :type="show1 ? 'text' : 'password'"
                                                            @click:append="show1 = !show1"
                                                            counter
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-form>
                                </v-card-text>

                                <v-divider></v-divider>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                            color="primary"
                                            text
                                            @click="dialog = false"
                                    >
                                        解锁
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </div>
                </v-overlay>
            </v-container>
        </v-content>
    </v-app>
</template>
<style>
    .lock_screen {
        background-size: cover;
        text-align: center;
    }
    #time{
        letter-spacing: 0.05em;
        font-size: 80px;
        padding: 5px 0;
    }
    #date{
        letter-spacing: 0.1em;
        font-size: 24px;
        text-align: center;
    }
</style>
<script>
    export default {
        name: 'lockscreen',
        data: () => ({
            show1: false,
            time: "",
            date: "",
            week: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
        }),
        props: {
            source: String,
        },
        created:function(){
            setInterval(this.updateTime, 1000);
        },
        methods: {
            updateTime() {
                var cd = new Date();
                this.time = this.zeroPadding(cd.getHours(), 2) + ':' + this.zeroPadding(cd.getMinutes(), 2) + ':' + this.zeroPadding(cd.getSeconds(), 2);
                this.date = this.zeroPadding(cd.getFullYear(), 4) + '-' + this.zeroPadding(cd.getMonth() + 1, 2) + '-' + this.zeroPadding(cd.getDate(), 2) + ' ' + this.week[cd.getDay()];
            },
            zeroPadding(num, digit) {
                var zero = '';
                for (var i = 0; i < digit; i++) {
                    zero += '0';
                }
                return (zero + num).slice(-digit);
            }
        }
    }
</script>