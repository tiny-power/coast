<template>
    <div :style="{ background: theme.background }">
        <div class="titlebar" :style="{ background: background }">
            <!-- <button
                :style="{
                    'margin-left': '75px',
                    height: '30px',
                    'border-radius': '8px',
                    background: '#797b88',
                    color: '#fff',
                    border: 'none',
                    padding: '0px 24px 0px 12px',
                    position: 'relative'
                }"
            >
                <i class="el-icon-menu" style="margin-right: 10px; font-size: 16px"></i>Vaults
            </button> -->
            <!-- <button
                :style="{
                    'margin-left': '8px',
                    height: '30px',
                    'border-radius': '8px',
                    background: '#797b88',
                    color: '#fff',
                    border: 'none',
                    padding: '0px 24px 0px 12px'
                }"
            >
                <i class="el-icon-s-finance" style="margin-right: 10px; font-size: 16px"></i>SFTP
            </button> -->
            <el-tabs
                v-model="activeName"
                type="card"
                @tab-remove="removeTab"
                @tab-click="tabClick"
                :style="{
                    'margin-left': '75px',
                    'max-width': clientWidth - 75 - 30 + 'px'
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
            <i class="el-icon-plus" @click="addTab" style="font-weight: bold; cursor: pointer; color: #797b88"></i>
            <!-- <i
                class="el-icon-s-open"
                @click="addTab"
                style="margin-left: 16px; position: absolute; right: 15px; color: #797b88; font-size: 18px"
            ></i> -->
        </div>
        <div>
            <div v-for="(item, key) in tabs" :key="key" :label="item.label" :name="item.name">
                <div
                    :ref="item.name"
                    v-show="activeName === item.name"
                    :style="{ height: clientHeight - 62 + 'px', overflow: 'auto', padding: '6px' }"
                ></div>
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
import '@xterm/xterm/css/xterm.css'
import os from 'os'

export default {
    data() {
        return {
            clientWidth: document.documentElement.clientWidth || document.body.clientWidth,
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            background: '#353951',
            activeName: '',
            tabs: {},
            initActiveName: '',
            theme: {
                background: '#000',
                foreground: '#fff'
            }
        }
    },
    mounted() {
        let nodeId = Math.random().toString(36).slice(-6)
        this.initActiveName = nodeId
        this.activeName = nodeId
        let item = {
            label: 'SHELL',
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
        })
        window.ipcRenderer.on('terminal', (event, name, data) => {
            let item = this.tabs[name]
            if (item) {
                item.xterm.write(data)
            }
        })
    },
    methods: {
        addTab() {
            let nodeId = Math.random().toString(36).slice(-6)
            let item = {
                label: 'SHELL',
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
        removeTab(targetName) {
            let activeName = this.activeName
            if (activeName === targetName) {
                activeName = this.initActiveName
            }
            this.dispose(this.tabs[targetName])
            this.activeName = activeName
            this.$delete(this.tabs, targetName)
            // delete this.tabs[targetName]
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
                    item.xterm.focus()
                })
            }
        },
        initTerminal(item) {
            item.xterm = new Terminal({
                cursorBlink: os.platform() === 'win32' ? true : false,
                cursorStyle: os.platform() === 'win32' ? 'underline' : 'block',
                fontFamily: 'monospace',
                fontSize: 14,
                lineHeight: 1.0,
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
            window.ipcRenderer.invoke('terminal', item.name)
            item.fitAddon.fit()
            item.xterm.focus()
        },
        terminalOnData(name, data) {
            const isCtrlV = data === '\u0016'
            if (isCtrlV) {
                navigator.clipboard.readText().then(text => {
                    window.ipcRenderer.invoke('write', name, text)
                })
            } else {
                window.ipcRenderer.invoke('write', name, data)
            }
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
    position: sticky;
    top: 0px;
    z-index: 10000;
}
::v-deep .el-input.is-disabled .el-input__inner {
    background-color: #f3f1f2;
}
::v-deep .el-input__inner {
    padding: 0 7.7px;
    background-color: #f3f1f2;
}
::v-deep .el-input-group__append {
    background-color: #f3f1f2;
    padding: 0 8px;
}
::v-deep .el-input.is-disabled .el-input__inner {
    color: #606266;
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
    border-color: #272727;
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
::v-deep .el-form-item {
    margin-top: 12px;
    margin-bottom: 0px;
}
::v-deep .el-input__inner::placeholder {
    font-size: 12px;
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
    height: 31px;
    line-height: 31px;
    font-size: 12px;
    border-left: none !important;
    border-radius: 12px !important;
    margin-right: 8px !important;
    background: #000;
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
</style>
