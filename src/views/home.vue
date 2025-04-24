<template>
    <div :style="{ background: theme.background }" @click="isMenuVisible = false">
        <div class="titlebar" :style="{ background: theme.background }">
            <button
                :style="{
                    'margin-left': platform === 'darwin' ? '75px' : '10px',
                    height: '30px',
                    'border-radius': '8px',
                    background: 'rgb(121,123,136,0.1)',
                    color: '#797b88',
                    border: 'none',
                    padding: '0px 24px 0px 12px',
                    position: 'relative',
                    cursor: 'pointer',
                    '-webkit-app-region': 'no-drag'
                }"
            >
                <i class="el-icon-menu" style="margin-right: 10px; font-size: 16px"></i>Hosts
            </button>
            <button
                :style="{
                    'margin-left': '8px',
                    height: '30px',
                    'border-radius': '8px',
                    background: 'rgb(121,123,136,0.1)',
                    color: '#797b88',
                    border: 'none',
                    padding: '0px 24px 0px 12px',
                    cursor: 'pointer',
                    '-webkit-app-region': 'no-drag'
                }"
            >
                <i class="el-icon-s-finance" style="margin-right: 10px; font-size: 16px"></i>SFTP
            </button>
            <el-tabs
                v-model="activeName"
                type="card"
                @tab-remove="removeTab"
                @tab-click="tabClick"
                :style="{
                    'max-width': platform === 'darwin' ? clientWidth - 367 + 'px' : clientWidth - 439 + 'px',
                    '-webkit-app-region': 'no-drag'
                }"
            >
                <el-tab-pane
                    :closable="index != 0"
                    v-for="(item, key, index) in tabs"
                    :key="key"
                    :label="item.label"
                    :name="item.name"
                >
                </el-tab-pane>
            </el-tabs>
            <div
                :style="{
                    width: '46px',
                    height: '50px',
                    '-webkit-app-region': 'no-drag',
                    display: 'flex',
                    'justify-content': 'center',
                    'align-items': 'center'
                }"
            >
                <i
                    class="el-icon-plus"
                    style="cursor: pointer; color: #797b88; font-weight: bold; font-size: 14px"
                    @click="addTab"
                ></i>
            </div>
            <div
                :style="{
                    width: '46px',
                    height: '50px',
                    'margin-left': '16px',
                    position: 'absolute',
                    right: platform === 'darwin' ? '0px' : '137px',
                    '-webkit-app-region': 'no-drag',
                    display: 'flex',
                    'justify-content': 'center',
                    'align-items': 'center'
                }"
            >
                <i
                    class="el-icon-c-scale-to-original"
                    :style="{
                        color: '#797b88',
                        'font-size': '20px',
                        cursor: 'pointer'
                    }"
                    @click="handleSetting"
                ></i>
            </div>
        </div>
        <div style="display: flex">
            <div v-for="(item, key) in tabs" :key="key" :label="item.label" :name="item.name" style="flex: 1">
                <div
                    :ref="item.name"
                    v-show="activeName === item.name"
                    :style="{
                        width: settingFlag ? clientWidth - 330 + 'px' : clientWidth - 20 + 'px',
                        height: clientHeight - 60 + 'px',
                        overflow: 'auto',
                        padding: '10px 10px 0px 10px'
                    }"
                ></div>
            </div>
            <div
                v-if="settingFlag"
                :style="{
                    width: '300px',
                    height: clientHeight - 70 + 'px',
                    overflow: 'auto',
                    padding: '6px',
                    'border-radius': '8px',
                    margin: '10px 10px 10px 0px',
                    'box-sizing': 'border-box',
                    background: 'rgb(121,123,136,0.1)',
                    overflow: 'auto'
                }"
            >
                <div style="display: flex">
                    <div
                        :style="{
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            'justify-content': 'center',
                            'align-items': 'center'
                        }"
                    >
                        <svg
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            p-id="7395"
                            width="18"
                            height="18"
                            :style="{
                                background: attribute === 'snippet' ? 'rgb(121, 123, 136, 0.2)' : 'transparent',
                                padding: '6px',
                                'border-radius': '8px',
                                cursor: 'pointer'
                            }"
                            @click="attribute = 'snippet'"
                        >
                            <path
                                d="M158.165333 499.498667A42.496 42.496 0 0 0 170.666667 469.333333V256a42.666667 42.666667 0 0 1 42.666666-42.666667 42.666667 42.666667 0 0 0 0-85.333333C142.762667 128 85.333333 185.429333 85.333333 256v195.669333l-30.165333 30.165334a42.666667 42.666667 0 0 0 0 60.330666l30.165333 30.165334V768c0 70.570667 57.429333 128 128 128a42.666667 42.666667 0 0 0 0-85.333333 42.666667 42.666667 0 0 1-42.666666-42.666667v-213.333333a42.496 42.496 0 0 0-12.501334-30.165334L145.664 512l12.501333-12.501333zM978.090667 495.658667a42.709333 42.709333 0 0 0-9.258667-13.824L938.666667 451.669333V256c0-70.570667-57.429333-128-128-128a42.666667 42.666667 0 1 0 0 85.333333 42.666667 42.666667 0 0 1 42.666666 42.666667v213.333333a42.581333 42.581333 0 0 0 12.501334 30.165334l12.501333 12.501333-12.501333 12.501333A42.496 42.496 0 0 0 853.333333 554.666667v213.333333a42.666667 42.666667 0 0 1-42.666666 42.666667 42.666667 42.666667 0 1 0 0 85.333333c70.570667 0 128-57.429333 128-128v-195.669333l30.165333-30.165334a42.709333 42.709333 0 0 0 9.258667-46.506666zM669.738667 225.450667a42.752 42.752 0 0 0-69.546667 14.762666l-255.829333 512a42.624 42.624 0 0 0 23.893333 55.424 42.922667 42.922667 0 0 0 55.552-23.765333l255.786667-512a42.538667 42.538667 0 0 0-9.813334-46.421333z"
                                :fill="attribute === 'snippet' ? theme.foreground : '#797b88'"
                                p-id="7396"
                            ></path>
                        </svg>
                    </div>
                    <div
                        :style="{
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            'justify-content': 'center',
                            'align-items': 'center'
                        }"
                    >
                        <svg
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            p-id="9624"
                            width="18"
                            height="18"
                            :style="{
                                background: attribute === 'color' ? 'rgb(121, 123, 136, 0.2)' : 'transparent',
                                padding: '6px',
                                'border-radius': '8px',
                                cursor: 'pointer'
                            }"
                            @click="attribute = 'color'"
                        >
                            <path
                                d="M512 68.266667C267.377778 68.266667 68.266667 267.377778 68.266667 512s199.111111 443.733333 443.733333 443.733333c108.088889 0 113.777778-96.711111 119.466667-159.288889 5.688889-39.822222 5.688889-85.333333 28.444444-113.777777 17.066667-17.066667 68.266667-28.444444 113.777778-39.822223 79.644444-17.066667 182.044444-39.822222 182.044444-130.844444 0-244.622222-199.111111-443.733333-443.733333-443.733333z m244.622222 489.244444c-62.577778 11.377778-125.155556 22.755556-159.288889 68.266667-39.822222 45.511111-45.511111 108.088889-51.2 159.288889-5.688889 79.644444-17.066667 85.333333-34.133333 85.333333-193.422222 0-352.711111-159.288889-352.711111-352.711111S318.577778 159.288889 512 159.288889s352.711111 159.288889 352.711111 352.711111c0 22.755556-56.888889 34.133333-108.088889 45.511111z"
                                :fill="attribute === 'color' ? theme.foreground : '#797b88'"
                                p-id="9625"
                            ></path>
                            <path
                                d="M591.644444 221.866667c-51.2 0-96.711111 39.822222-96.711111 91.022222s39.822222 91.022222 96.711111 91.022222S682.666667 364.088889 682.666667 312.888889s-39.822222-91.022222-91.022223-91.022222z m0 113.777777c-11.377778 0-28.444444-11.377778-28.444444-22.755555s11.377778-22.755556 28.444444-22.755556 28.444444 11.377778 28.444445 22.755556-17.066667 22.755556-28.444445 22.755555zM352.711111 489.244444c51.2 0 91.022222-39.822222 91.022222-96.711111 0-51.2-39.822222-91.022222-91.022222-91.022222-51.2-5.688889-96.711111 39.822222-96.711111 91.022222 0 51.2 45.511111 96.711111 96.711111 96.711111z m0-119.466666c11.377778 0 22.755556 11.377778 22.755556 22.755555s-11.377778 28.444444-22.755556 28.444445-22.755556-17.066667-22.755555-28.444445 11.377778-22.755556 22.755555-22.755555zM369.777778 557.511111c-51.2 0-91.022222 39.822222-91.022222 91.022222S318.577778 739.555556 369.777778 739.555556c51.2 0 96.711111-39.822222 96.711111-91.022223s-39.822222-91.022222-96.711111-91.022222z m0 119.466667c-11.377778 0-22.755556-11.377778-22.755556-28.444445s11.377778-22.755556 22.755556-22.755555 28.444444 11.377778 28.444444 28.444444-11.377778 22.755556-28.444444 22.755556z"
                                :fill="attribute === 'color' ? theme.foreground : '#797b88'"
                                p-id="9626"
                            ></path>
                        </svg>
                    </div>
                </div>
                <div v-if="attribute === 'snippet' && !showAddSnippet && !showEditSnippet">
                    <div
                        :style="{
                            background: 'rgb(121, 123, 136, 0.2)',
                            'margin-top': '15px',
                            'margin-bottom': '15px',
                            width: '110px',
                            'border-radius': '8px',
                            'text-align': 'center',
                            color: theme.foreground,
                            'font-size': '13px',
                            padding: '6px 0px',
                            cursor: 'pointer'
                        }"
                        @click="handleNewSnippet"
                    >
                        New Snippet
                    </div>
                    <div :style="{ height: clientHeight - 180 + 'px', overflow: 'auto' }">
                        <div
                            v-for="(item, index) in snippetList"
                            :key="index"
                            :style="{
                                color: theme.foreground,
                                'margin-bottom': '15px',
                                background: 'rgb(121, 123, 136, 0.2)',
                                'border-radius': '8px',
                                padding: '10px 10px',
                                'font-size': '13px'
                            }"
                            @contextmenu.prevent="showMenu($event, index)"
                        >
                            <div style="display: flex; align-items: center">
                                <div style="flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
                                    {{ item.name }}
                                </div>
                                <div style="width: 95px; font-size: 7px">
                                    <span
                                        style="
                                            background: rgb(121, 123, 136, 0.1);
                                            padding: 4px 12px;
                                            border-radius: 6px;
                                            cursor: pointer;
                                            font-weight: bold;
                                        "
                                        @click="handleRun(item.script)"
                                        >RUN</span
                                    >
                                    <span
                                        style="
                                            background: rgb(121, 123, 136, 0.1);
                                            padding: 4px 12px;
                                            border-radius: 6px;
                                            margin-left: 10px;
                                            cursor: pointer;
                                            font-weight: bold;
                                        "
                                        @click="handlePaste(item.script)"
                                        >PASTE</span
                                    >
                                </div>
                            </div>
                            <div
                                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 8px"
                            >
                                {{ item.script }}
                            </div>
                        </div>
                        <ul
                            v-if="isMenuVisible"
                            :style="{
                                top: menuTop + 'px',
                                left: menuLeft + 'px',
                                background: theme.background,
                                color: theme.foreground
                            }"
                        >
                            <li @click="menuAction('edit')">Edit</li>
                            <li @click="menuAction('delete')">Delete</li>
                        </ul>
                    </div>
                </div>
                <div v-if="attribute === 'snippet' && showAddSnippet">
                    <div style="display: flex; align-items: center">
                        <div :style="{ flex: 1, color: theme.foreground }">
                            <i
                                class="el-icon-back"
                                style="margin-right: 6px; cursor: pointer"
                                @click="showAddSnippet = false"
                            ></i>
                            New Snippet
                        </div>
                        <div
                            :style="{
                                background: 'rgb(121, 123, 136, 0.2)',
                                'margin-top': '15px',
                                'margin-bottom': '15px',
                                width: '60px',
                                'border-radius': '8px',
                                'text-align': 'center',
                                color: theme.foreground,
                                'font-size': '13px',
                                padding: '6px 0px',
                                cursor: 'pointer'
                            }"
                            @click="handleSaveSnippet"
                        >
                            Save
                        </div>
                    </div>
                    <div :style="{ height: clientHeight - 180 + 'px', overflow: 'auto' }">
                        <el-form ref="snippetForm" :model="snippetForm" :rules="rules" label-width="0px">
                            <el-form-item prop="name">
                                <el-input v-model="snippetForm.name" placeholder="Action description"></el-input>
                            </el-form-item>
                            <el-form-item prop="script">
                                <el-input
                                    type="textarea"
                                    v-model="snippetForm.script"
                                    :autosize="{ minRows: 6, maxRows: 6 }"
                                    placeholder="Action Script"
                                    resize="none"
                                ></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div v-if="attribute === 'snippet' && showEditSnippet">
                    <div style="display: flex; align-items: center">
                        <div :style="{ flex: 1, color: theme.foreground }">
                            <i
                                class="el-icon-back"
                                style="margin-right: 6px; cursor: pointer"
                                @click="showEditSnippet = false"
                            ></i>
                            Edit Snippet
                        </div>
                        <div
                            :style="{
                                background: 'rgb(121, 123, 136, 0.2)',
                                'margin-top': '15px',
                                'margin-bottom': '15px',
                                width: '60px',
                                'border-radius': '8px',
                                'text-align': 'center',
                                color: theme.foreground,
                                'font-size': '13px',
                                padding: '6px 0px',
                                cursor: 'pointer'
                            }"
                            @click="handleUpdateSnippet"
                        >
                            Save
                        </div>
                    </div>
                    <div :style="{ height: clientHeight - 180 + 'px', overflow: 'auto' }">
                        <el-form ref="snippetForm" :model="snippetForm" :rules="rules" label-width="0px">
                            <el-form-item prop="name">
                                <el-input v-model="snippetForm.name" placeholder="Action description"></el-input>
                            </el-form-item>
                            <el-form-item prop="script">
                                <el-input
                                    type="textarea"
                                    v-model="snippetForm.script"
                                    :autosize="{ minRows: 6, maxRows: 6 }"
                                    placeholder="Action Script"
                                    resize="none"
                                ></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div v-if="attribute === 'color'">
                    <div style="color: #797b88; margin-top: 10px; margin-bottom: 15px; font-size: 14px">Themes</div>
                    <div :style="{ height: clientHeight - 165 + 'px', overflow: 'auto' }">
                        <div
                            v-for="(item, key) in themes"
                            :key="key"
                            style="color: #797b88; display: flex; margin-bottom: 15px; cursor: pointer"
                            @click="changeTheme(key, item)"
                        >
                            <div
                                :style="{
                                    width: '72px',
                                    height: '45px',
                                    background: item.background,
                                    'border-radius': '8px'
                                }"
                            ></div>
                            <div style="margin-left: 10px; font-size: 13px">{{ key }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ClientJS } from 'clientjs'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { ClipboardAddon } from '@xterm/addon-clipboard'
import { SearchAddon } from '@xterm/addon-search'
import { WebLinksAddon } from '@xterm/addon-web-links'
import themes from '@/themes/index'
import '@xterm/xterm/css/xterm.css'
import os from 'os'
const { Client } = require('ssh2')

export default {
    data() {
        return {
            clientWidth: document.documentElement.clientWidth || document.body.clientWidth,
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            mainBackground: '#353951',
            auxBackgroudColor: '#edf1f2',
            activeName: '',
            tabs: {},
            initActiveName: '',
            theme: {},
            platform: os.platform(),
            settingFlag: true,
            themes: themes,
            attribute: 'snippet',
            snippetList: [],
            snippetForm: {
                name: '',
                script: ''
            },
            rules: {
                name: [{ required: true, message: 'Action description', trigger: 'blur' }],
                script: [{ required: true, message: 'Action Script', trigger: 'blur' }]
            },
            showAddSnippet: false,
            showEditSnippet: false,
            index: -1,
            isMenuVisible: false,
            menuTop: 0,
            menuLeft: 0
        }
    },
    mounted() {
        let themeName = localStorage.getItem('theme') || 'Monokai'
        localStorage.setItem('theme', themeName)
        let settingFlag = localStorage.getItem('settingFlag')
        if (settingFlag == 'false') {
            this.settingFlag = false
        } else {
            this.settingFlag = true
        }
        this.theme = this.themes[themeName]
        let nodeId = Math.random().toString(36).slice(-6)
        this.initActiveName = nodeId
        this.activeName = nodeId
        let item = {
            label: 'Terminal',
            name: nodeId,
            xterm: null,
            fitAddon: null,
            clipboardAddon: null,
            searchAddon: null,
            webLinksAddon: null
        }
        this.tabs[nodeId] = item
        this.$nextTick(() => {
            this.initTerminal(item)
            if (os.platform() != 'darwin') {
                window.ipcRenderer.invoke('setTitleBarOverlay', this.theme.background)
            }
        })
        window.ipcRenderer.on('terminal', (event, name, data) => {
            let item = this.tabs[name]
            if (item) {
                item.xterm.write(data)
            }
        })
        this.querySnippetAll()
    },
    methods: {
        showMenu(event, index) {
            this.index = index
            this.isMenuVisible = true
            this.menuTop = event.clientY
            this.menuLeft = event.clientX
        },
        menuAction(action) {
            this.isMenuVisible = false
            if (action === 'delete') {
                let snippet = this.snippetList[this.index]
                this.handleDeleteSnippet(snippet.id)
                this.snippetList.splice(this.index, 1)
            } else if (action === 'edit') {
                let snippet = this.snippetList[this.index]
                this.snippetForm = JSON.parse(JSON.stringify(snippet))
                this.showEditSnippet = true
                this.$nextTick(() => {
                    let inputItems = document.querySelectorAll('.el-input__inner')
                    inputItems.forEach(item => {
                        item.style.color = this.theme.foreground
                    })
                    let textareaItems = document.querySelectorAll('.el-textarea__inner')
                    textareaItems.forEach(item => {
                        item.style.color = this.theme.foreground
                    })
                })
            }
        },
        handleRun(script) {
            let item = this.tabs[this.activeName]
            window.ipcRenderer.invoke('write', this.activeName, '\x15')
            window.ipcRenderer.invoke(
                'write',
                this.activeName,
                this.platform === 'win32' ? script + '\r\n' : script + '\n'
            )
            item.xterm.focus()
        },
        handlePaste(script) {
            let item = this.tabs[this.activeName]
            window.ipcRenderer.invoke('write', this.activeName, '\x15')
            window.ipcRenderer.invoke('write', this.activeName, script)
            item.xterm.focus()
        },
        handleNewSnippet() {
            this.snippetForm = {
                name: '',
                script: ''
            }
            this.showAddSnippet = true
            this.$nextTick(() => {
                let inputItems = document.querySelectorAll('.el-input__inner')
                inputItems.forEach(item => {
                    item.style.color = this.theme.foreground
                })
                let textareaItems = document.querySelectorAll('.el-textarea__inner')
                textareaItems.forEach(item => {
                    item.style.color = this.theme.foreground
                })
            })
        },
        async handleSaveSnippet() {
            this.$refs.snippetForm.validate(async valid => {
                if (valid) {
                    let sql = 'INSERT INTO snippet (name, script, targets) VALUES (?, ?, ?)'
                    let result = await window.ipcRenderer.invoke('db_insert', sql, [
                        this.snippetForm.name,
                        this.snippetForm.script,
                        ''
                    ])
                    this.snippetList.unshift({
                        name: this.snippetForm.name,
                        script: this.snippetForm.script
                    })
                    this.showAddSnippet = false
                }
            })
        },
        handleEditSnippet() {
            this.snippetForm = {
                name: '',
                script: ''
            }
            this.showEditSnippet = true
        },
        async handleUpdateSnippet() {
            this.$refs.snippetForm.validate(async valid => {
                if (valid) {
                    let sql = 'UPDATE snippet SET name = ?, script = ?, targets =? WHERE id = ?'
                    let result = await window.ipcRenderer.invoke('db_update', sql, [
                        this.snippetForm.name,
                        this.snippetForm.script,
                        '',
                        this.snippetForm.id
                    ])
                    this.$set(this.snippetList, this.index, this.snippetForm)
                    this.showEditSnippet = false
                }
            })
        },
        async handleDeleteSnippet(id) {
            let sql = 'DELETE FROM snippet WHERE id = ?'
            let result = await window.ipcRenderer.invoke('db_delete', sql, [id])
        },
        async querySnippetAll() {
            this.snippetList = await window.ipcRenderer.invoke(
                'db_all',
                'select * from snippet order by upodate_time desc'
            )
        },
        addTab() {
            let nodeId = Math.random().toString(36).slice(-6)
            let item = {
                label: 'Terminal',
                name: nodeId,
                xterm: null,
                fitAddon: null,
                clipboardAddon: null,
                searchAddon: null,
                webLinksAddon: null
            }
            this.tabs[nodeId] = item
            this.activeName = nodeId
            this.$nextTick(() => {
                this.initTerminal(item)
            })
        },
        handleSetting() {
            this.settingFlag = !this.settingFlag
            localStorage.setItem('settingFlag', this.settingFlag)
            for (const key in this.tabs) {
                this.$nextTick(() => {
                    this.tabs[key].fitAddon.fit()
                    window.ipcRenderer.invoke('resize', key, this.tabs[key].xterm.rows, this.tabs[key].xterm.cols)
                })
            }
        },
        changeTheme(key, item) {
            if (os.platform() != 'darwin') {
                window.ipcRenderer.invoke('setTitleBarOverlay', item.background)
            }
            let xterm = this.tabs[this.activeName].xterm
            xterm.options.theme = item
            xterm.focus()
            this.theme = item
            localStorage.setItem('theme', key)
            this.$nextTick(() => {
                let tabsItems = document.querySelectorAll('.el-tabs__item')
                tabsItems.forEach(item => {
                    if (item.classList.contains('is-active')) {
                        item.style.backgroundColor = this.hexToRgb(this.theme.foreground)
                        item.style.color = this.theme.foreground
                    } else {
                        item.style.backgroundColor = 'rgb(121,123,136,0.1)'
                        item.style.color = '#797b88'
                    }
                })
            })
        },
        removeTab(targetName) {
            let activeName = this.activeName
            if (activeName === targetName) {
                activeName = this.initActiveName
            }
            this.dispose(this.tabs[targetName])
            this.activeName = activeName
            this.$delete(this.tabs, targetName)
            // delete this.tabs[targetName]
            this.$nextTick(() => {
                let item = this.tabs[this.activeName]
                item.xterm.options.theme = this.theme
                item.xterm.focus()
                let tabsItems = document.querySelectorAll('.el-tabs__item')
                tabsItems.forEach(item => {
                    if (item.classList.contains('is-active')) {
                        item.style.backgroundColor = this.hexToRgb(this.theme.foreground)
                        item.style.color = this.theme.foreground
                    } else {
                        item.style.backgroundColor = 'rgb(121,123,136,0.1)'
                        item.style.color = '#797b88'
                    }
                })
            })
        },
        dispose(item) {
            item.fitAddon.dispose()
            item.clipboardAddon.dispose()
            item.searchAddon.dispose()
            item.webLinksAddon.dispose()
            item.xterm.dispose(this.$refs[item.name])
            window.ipcRenderer.invoke('dispose', item.name)
        },
        tabClick(tab) {
            let item = this.tabs[tab.name]
            if (item) {
                this.$nextTick(() => {
                    item.xterm.options.theme = this.theme
                    item.xterm.focus()
                    let tabsItems = document.querySelectorAll('.el-tabs__item')
                    tabsItems.forEach(item => {
                        if (item.classList.contains('is-active')) {
                            item.style.backgroundColor = this.hexToRgb(this.theme.foreground)
                            item.style.color = this.theme.foreground
                        } else {
                            item.style.backgroundColor = 'rgb(121,123,136,0.1)'
                            item.style.color = '#797b88'
                        }
                    })
                })
            }
        },
        initTerminal(item) {
            item.xterm = new Terminal({
                cursorBlink: this.platform === 'win32' ? true : false,
                cursorStyle: this.platform === 'win32' ? 'underline' : 'block',
                fontFamily: 'monospace',
                fontSize: 14,
                lineHeight: 1.2,
                theme: this.theme
            })
            item.xterm.open(this.$refs[item.name][0])
            item.fitAddon = new FitAddon()
            item.xterm.loadAddon(item.fitAddon)
            item.clipboardAddon = new ClipboardAddon()
            item.xterm.loadAddon(item.clipboardAddon)
            item.searchAddon = new SearchAddon()
            item.xterm.loadAddon(item.searchAddon)
            item.webLinksAddon = new WebLinksAddon()
            item.xterm.loadAddon(item.webLinksAddon)
            window.addEventListener('resize', () => {
                try {
                    this.clientWidth = document.documentElement.clientWidth || document.body.clientWidth
                    this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight
                    item.fitAddon.fit()
                    window.ipcRenderer.invoke('resize', item.name, item.xterm.rows, item.xterm.cols)
                } catch (e) {
                    this.$message.error(e.message)
                }
            })
            item.xterm.onData(data => this.terminalOnData(item.name, data))
            item.xterm.onSelectionChange(() => {
                if (item.xterm.hasSelection()) {
                    navigator.clipboard.writeText(item.xterm.getSelection())
                }
            })
            //item.xterm.onKey(event => this.terminalOnKey(event))
            item.xterm.element.addEventListener('contextmenu', event => {
                event.preventDefault()
                navigator.clipboard.readText().then(text => {
                    window.ipcRenderer.invoke('write', item.name, text)
                })
            })
            item.fitAddon.fit()
            window.ipcRenderer.invoke('terminal', item.name, item.xterm.rows, item.xterm.cols)
            item.xterm.focus()
            this.$nextTick(() => {
                let tabsItems = document.querySelectorAll('.el-tabs__item')
                tabsItems.forEach(item => {
                    if (item.classList.contains('is-active')) {
                        item.style.backgroundColor = this.hexToRgb(this.theme.foreground)
                        item.style.color = this.theme.foreground
                    } else {
                        item.style.backgroundColor = 'rgb(121,123,136,0.1)'
                        item.style.color = '#797b88'
                    }
                })
            })
        },
        hexToRgb(hex) {
            hex = hex.replace(/^#/, '')
            let r = parseInt(hex.substring(0, 2), 16)
            let g = parseInt(hex.substring(2, 4), 16)
            let b = parseInt(hex.substring(4, 6), 16)
            return `rgb(${r}, ${g}, ${b}, 0.15)`
        },
        terminalOnData(name, data) {
            window.ipcRenderer.invoke('write', name, data)
        }
    }
}
</script>

<style scoped>
.titlebar {
    height: 50px;
    -webkit-app-region: drag;
    display: flex;
    align-items: center;
}
::v-deep .el-input.is-disabled .el-input__inner {
    background-color: #f3f1f2;
    color: #606266;
}
::v-deep .el-input__inner {
    border-color: #797b88;
    background-color: rgb(121, 123, 136, 0.1);
}
::v-deep .el-textarea__inner {
    border-color: #797b88;
    background-color: rgb(121, 123, 136, 0.1);
}
::v-deep .el-input-group__append {
    background-color: #f3f1f2;
    padding: 0 8px;
}
::v-deep .el-select {
    width: 100%;
}
::v-deep .el-slider__bar {
    background-color: #272727;
}
::v-deep .el-select .el-input__inner:focus {
    border-color: #272727;
}
::v-deep .el-button--primary {
    background-color: #272727;
    border-color: #272727;
}
::v-deep .el-input__inner:focus {
    border-color: #797b88;
}
::v-deep .el-textarea__inner:focus {
    border-color: #797b88;
}
::v-deep .el-button--primary.is-disabled:hover {
    background-color: #909399;
    border-color: #909399;
}
::v-deep .el-button--default {
    border: 1px solid #272727;
    color: #272727;
}
::v-deep .el-button--small {
    border-radius: 6px;
}
::v-deep .el-form-item__label {
    line-height: 26px;
    padding: 0px;
    font-size: 13px;
}
::v-deep .el-input__inner::placeholder {
    font-size: 13px;
    color: #797b88;
}
::v-deep .el-textarea__inner::placeholder {
    font-size: 13px;
    color: #797b88;
}
::v-deep .el-select-dropdown__item.selected {
    color: #272727;
}
::v-deep .el-button:active {
    color: #272727;
    border-color: #272727;
}
::v-deep .el-button--default:hover {
    color: #272727;
    border-color: #272727;
    background-color: #fff;
}
::v-deep .el-table__cell {
    padding: 8px 0;
}
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #272727;
    border-color: #272727;
}
::v-deep .el-checkbox__inner {
    border-color: #272727 !important;
}
::v-deep .el-checkbox__inner:hover {
    border-color: #272727;
}
::v-deep .el-table td.el-table__cell {
    border-bottom: 1px solid #eaeaea;
}
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner,
::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #272727;
    border-color: #272727;
}
::v-deep .el-input--medium {
    font-size: 12px;
}
::v-deep .el-dialog__body {
    padding: 0px 20px 10px 20px;
}
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #272727;
    border-color: #272727;
}
::v-deep .el-checkbox__inner:hover {
    border-color: #272727;
}
::v-deep .el-checkbox {
    color: #272727;
    font-weight: 400;
}
::v-deep .el-checkbox__label {
    font-size: 12px;
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #272727;
}
::v-deep .el-cascader-menu {
    min-width: auto;
}
::v-deep .el-cascader-menu__wrap {
    width: auto;
    height: auto;
}
::v-deep .el-cascader-node.is-active {
    color: #272727;
}
::v-deep .el-cascader-node.in-active-path {
    color: #272727;
}
::v-deep .el-cascader-panel.is-bordered {
    border-radius: 8px;
    background: #fff;
}
::v-deep .el-cascader-node {
    padding: 0 10px 0 10px !important;
}
::v-deep .el-breadcrumb__inner {
    cursor: pointer !important;
}
::v-deep .el-switch.is-checked .el-switch__core {
    border-color: #272727;
    background-color: #272727;
}
::v-deep .el-select .el-input.is-focus .el-input__inner {
    border-color: #272727;
}
::v-deep .el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
    color: #272727;
}
::v-deep .el-tabs__header {
    margin: 0px;
    border-bottom: none;
}
::v-deep .el-tabs__item {
    color: #fff;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    border-left: none !important;
    border-radius: 8px !important;
    margin-left: 10px !important;
}
::v-deep .el-tabs__item.is-active {
    border-bottom: none;
}
::v-deep .el-tabs__nav {
    border: none !important;
}
::v-deep .el-tabs__nav-prev {
    top: -5px;
}
::v-deep .el-tabs__nav-next {
    top: -5px;
    margin-right: 6px;
    margin-right: 6px;
}
ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    position: absolute;
    z-index: 1000;
    border-radius: 12px;
    padding: 8px;
}
li {
    padding: 8px;
    cursor: pointer;
    width: 100px;
    font-size: 13px;
}
li:hover {
    border-radius: 8px;
    background-color: rgb(121, 123, 136, 0.1);
}
</style>
