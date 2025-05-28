<template>
    <div :style="{ background: theme.background }" @click="handleClick">
        <div class="titlebar" :style="{ background: classify === 'Sessions' ? theme.background : mainBackground }">
            <button
                :style="{
                    'margin-left': platform === 'darwin' ? '75px' : '10px',
                    height: '30px',
                    'border-radius': '8px',
                    background: 'rgb(121,123,136,0.1)',
                    color: classify === 'Sessions' ? '#797b88' : '#fff',
                    border: 'none',
                    padding: '0px 24px 0px 12px',
                    position: 'relative',
                    cursor: 'pointer',
                    '-webkit-app-region': 'no-drag'
                }"
                @click="handleHosts"
            >
                <i class="el-icon-menu" style="margin-right: 10px; font-size: 16px"></i>Hosts
            </button>
            <button
                :style="{
                    'margin-left': '8px',
                    height: '30px',
                    'border-radius': '8px',
                    background: 'rgb(121,123,136,0.1)',
                    color: classify === 'Sessions' ? '#797b88' : '#fff',
                    border: 'none',
                    padding: '0px 24px 0px 12px',
                    cursor: 'pointer',
                    '-webkit-app-region': 'no-drag'
                }"
                @click="handleSFTP"
            >
                <i class="el-icon-folder" style="margin-right: 10px; font-size: 16px"></i>SFTP
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
                    :closable="true"
                    v-for="(item, key, index) in tabs"
                    :key="key"
                    :label="index + 1 + '. ' + item.label"
                    :name="item.name"
                >
                </el-tab-pane>
                <!-- :closable="index != 0" -->
            </el-tabs>
            <el-dropdown size="medium" @command="handleCommand">
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
                    ></i>
                </div>
                <el-dropdown-menu slot="dropdown" placement="bottom">
                    <el-dropdown-item command="shell">Local Shell</el-dropdown-item>
                    <el-dropdown-item command="ssh">SSH</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
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
                v-if="classify === 'Sessions'"
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
        <div
            v-if="classify === 'Hosts'"
            :style="{
                background: auxBackgroudColor,
                height: clientHeight - 50 + 'px',
                overflow: 'auto',
                'box-sizing': 'border-box',
                padding: '30px'
            }"
        >
            <div v-if="sessionList.length != 0">
                <div style="font-size: 18px; color: #303133; font-weight: 450; margin-bottom: 20px">Hosts</div>
                <div
                    style="display: grid; grid-gap: 12px; grid-template-columns: repeat(auto-fit, minmax(290px, 350px))"
                >
                    <div
                        style="
                            background: #fff;
                            height: 60px;
                            border-radius: 12px;
                            display: flex;
                            align-items: center;
                            box-sizing: border-box;
                            cursor: pointer;
                        "
                        v-for="(item, index) in sessionList"
                        :key="index"
                        @dblclick="dblclick(item)"
                        @contextmenu.prevent="showSessionMenu($event, index)"
                    >
                        <div
                            style="
                                background: #014978;
                                width: 40px;
                                height: 40px;
                                border-radius: 8px;
                                margin: 0px 15px;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                            "
                        >
                            <img :src="require('@/assets/server.png')" width="20px" height="20px" />
                        </div>
                        <div>
                            <div style="font-size: 13px; color: #303133; font-weight: 450">
                                {{ item.label || item.host }}
                            </div>
                            <div style="font-size: 10px; color: #909399">
                                {{ item.protocol + ', ' + item.username }}
                            </div>
                            <div></div>
                        </div>
                    </div>
                    <ul
                        v-if="isSessionMenuVisible"
                        :style="{
                            top: menuTop + 'px',
                            left: menuLeft + 'px',
                            background: '#f7f9fa',
                            color: '#303133'
                        }"
                    >
                        <li @click="menuSessionAction('edit')" style="width: 250px">
                            <i class="el-icon-edit" style="color: #303133; margin-right: 8px; font-size: 16px"></i>
                            <span>Edit Host</span>
                        </li>
                        <li @click="menuSessionAction('remove')" style="width: 250px">
                            <i
                                class="el-icon-delete-solid"
                                style="color: #303133; margin-right: 8px; font-size: 16px"
                            ></i>
                            <span>Remove</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div
                v-else
                :style="{
                    height: clientHeight - 110 + 'px',
                    display: 'flex',
                    'justify-content': 'center',
                    'align-items': 'center',
                    'flex-direction': 'column'
                }"
            >
                <div class="profile">
                    <div>
                        <img :src="require('@/assets/icon.png')" width="60px" height="60px" />
                    </div>
                    <div style="font-size: 24px; color: #272727; margin: 15px 0px 5px 0px; font-weight: bold">
                        Welcome to Coast
                    </div>
                    <div style="font-size: 15px; margin-top: 5px; color: #606266; width: 405px; text-align: center">
                        Connect to a new host via SSH. Once you've added hosts, you'll find them here.
                    </div>
                    <div style="margin-top: 25px">
                        <el-button type="primary" size="medium" @click="handleCommand('shell')">Local Shell</el-button>
                        <el-button size="medium" @click="handleCommand('ssh')">Add New SSH</el-button>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="classify === 'SFTP'">
            <div
                :style="{
                    background: '#f7f9fa',
                    height: clientHeight - 50 + 'px',
                    'box-sizing': 'border-box',
                    display: 'flex',
                    'flex-direction': 'column'
                }"
            >
                <div style="height: 76px; display: flex; justify-content: center; align-items: center">
                    <el-autocomplete
                        v-model="search"
                        :fetch-suggestions="querySearch"
                        placeholder="Select from your saved Hosts"
                        @select="handleSelect"
                        style="min-width: 700px"
                        clearable
                    >
                        <template slot-scope="{ item }">
                            {{ item.label ? item.host + ' (' + item.label + ')' : item.host }}
                        </template>
                    </el-autocomplete>
                </div>
                <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr">
                    <div style="display: flex; flex-direction: column">
                        <div
                            style="
                                height: 32px;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                border: 1px solid #bdc3c7;
                            "
                        >
                            <div
                                style="
                                    width: 110px;
                                    text-align: center;
                                    font-size: 14px;
                                    background: #e9edef;
                                    height: 100%;
                                    line-height: 32px;
                                "
                            >
                                Local site:
                            </div>
                            <el-autocomplete
                                v-model="localPath"
                                :fetch-suggestions="queryLocalSearch"
                                placeholder=""
                                @select="handleLocalSelect"
                                size="small"
                                style="width: 100%"
                                @change="localPathChange"
                                class="autocomplete"
                            >
                                <template slot-scope="{ item }">
                                    {{ item }}
                                </template>
                            </el-autocomplete>
                        </div>
                        <div style="flex: 1; background: #fff">
                            <el-table
                                :data="localRowData"
                                :style="{ width: clientWidth / 2 + 'px', overflow: 'auto' }"
                                :height="clientHeight - 360"
                                @cell-dblclick="localRowDoubleClicked"
                                @row-contextmenu="localRowContextmenu"
                                border
                                highlight-selection-row
                                @selection-change="handleSelectionChange"
                                ref="localMultipleTable"
                                @row-click="handleLocalRowClick"
                                row-key="name"
                                @sort-change="localSortChange"
                                :row-class-name="tableRowClassName"
                            >
                                <template slot="empty">
                                    <div style="height: 100%">
                                        <el-empty description="Not connected to any server"></el-empty>
                                    </div>
                                </template>
                                <el-table-column
                                    prop="name"
                                    label="Name"
                                    :show-overflow-tooltip="true"
                                    sortable="custom"
                                >
                                    <template slot-scope="scope">
                                        <div style="display: flex; align-items: center">
                                            <img
                                                :src="require('@/assets/folder.png')"
                                                width="20px"
                                                height="20px"
                                                v-if="scope.row.kind === 'folder' || scope.row.kind === ''"
                                            />
                                            <svg
                                                viewBox="0 0 1024 1024"
                                                version="1.1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                v-if="scope.row.kind === 'file'"
                                            >
                                                <path
                                                    d="M637.194862 113.714901l0 189.396581 182.346001 0L649.150148 113.714901 637.194862 113.714901zM816.682769 896.959605c6.27696-6.275937 10.255575-14.8318 10.255575-24.52865L826.938344 355.018689l-195.461717 0 0 0c-12.534478 0-24.489764-5.13802-32.467459-13.693884l0 0c-8.555863-7.985882-13.674441-19.391652-13.674441-32.515554L585.334727 113.714901 229.169935 113.714901l0 0c-9.685593 0-18.232247 3.418866-24.498974 9.69685-6.26775 6.27696-9.69685 14.832823-9.69685 24.529673l0 0 0 724.489532 0 0c0 9.69685 3.429099 18.252713 9.69685 24.52865 6.26775 6.277984 14.813381 10.276041 24.498974 10.276041l0 0 563.02307 0 0 0C801.868365 907.235646 810.425252 903.236566 816.682769 896.959605L816.682769 896.959605zM229.169935 61.798485l442.211541 0 2.838651 0 1.719154 1.708921L876.518552 284.850583l1.720178 1.719154 0 2.278903 0 583.583338c0 23.968901-9.69685 45.639456-25.071002 61.051471l0 0c-15.392572 15.393595-37.044708 25.090445-60.974723 25.090445l0 0-563.02307 0 0 0c-23.360034 0-45.02138-9.69685-60.974723-25.090445-15.383362-15.413038-25.069979-37.08257-25.069979-61.051471L143.125233 147.941424c0-23.38971 9.686616-45.070498 25.069979-61.043285C184.148555 71.494311 205.809901 61.798485 229.169935 61.798485L229.169935 61.798485z"
                                                    fill="#E4E7ED"
                                                ></path>
                                            </svg>
                                            <svg
                                                viewBox="0 0 1024 1024"
                                                version="1.1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                v-if="scope.row.kind === 'link'"
                                            >
                                                <path
                                                    d="M399.432624 72.624113h551.943263v326.808511H399.432624z"
                                                    fill="#ffca27"
                                                ></path>
                                                <path
                                                    d="M0 660.879433h1024v326.80851c0 20.051518-16.376738 36.312057-36.573504 36.312057H36.573504C16.376738 1024 0 1007.739461 0 987.687943V660.879433z"
                                                    fill="#ffca27"
                                                ></path>
                                                <path
                                                    d="M36.573504 0h402.286751l219.426497 294.12766H1024V588.255319H0V36.762326C0 16.463887 16.376738 0 36.573504 0z"
                                                    fill="#ffca27"
                                                ></path>
                                                <path d="M0 363.120567h1024v588.25532H0z" fill="#ffca27"></path>
                                                <path
                                                    d="M449.456113 669.507177a73.379404 73.379404 0 0 1-56.378099 26.326241C352.46661 695.833418 319.546099 662.905645 319.546099 622.294241c0-40.604142 32.920511-73.531915 73.531915-73.531915 17.851007 0 34.220482 6.369135 46.958752 16.950468l126.024624-91.019801a49.021277 49.021277 0 1 1 21.53305 29.804936L461.569816 595.495943a73.902298 73.902298 0 0 1 3.703829 40.814752l140.288 66.806922a61.280227 61.280227 0 1 1-15.810269 33.18922l-140.302525-66.814185z"
                                                    fill="#ffffff"
                                                ></path>
                                            </svg>
                                            <div style="margin-left: 5px">
                                                {{ scope.row.name }}
                                            </div>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="size"
                                    label="Size"
                                    width="90"
                                    sortable="custom"
                                    :formatter="sizeFormatter"
                                >
                                </el-table-column>
                                <el-table-column prop="kind" label="Kind" width="80" sortable="custom">
                                </el-table-column>
                                <el-table-column
                                    prop="modifiedTime"
                                    label="Last modified"
                                    width="150"
                                    sortable="custom"
                                >
                                </el-table-column>
                            </el-table>
                            <ul
                                v-if="isLocalMenuVisible"
                                :style="{
                                    top: menuTop + 'px',
                                    left: menuLeft + 'px',
                                    background: '#f7f9fa',
                                    color: '#303133'
                                }"
                            >
                                <li
                                    @click="menuLocalAction('upload')"
                                    style="width: 250px"
                                    v-if="remoteRowData.length != 0"
                                >
                                    <span>Upload</span>
                                </li>
                                <!-- <li @click="menuLocalAction('Create directory')" style="width: 250px">
                                    <span>Create directory</span>
                                </li>
                                <li @click="menuLocalAction('Create directory and enter it')" style="width: 250px">
                                    <span>Create directory and enter it</span>
                                </li> -->
                                <li @click="menuLocalAction('refresh')" style="width: 250px">
                                    <span>Refresh</span>
                                </li>
                                <li @click="menuLocalAction('delete')" style="width: 250px">
                                    <span>Delete</span>
                                </li>
                                <!-- <li @click="menuLocalAction('rename')" style="width: 250px">
                                    <span>Rename</span>
                                </li> -->
                            </ul>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column">
                        <div
                            style="
                                height: 32px;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                border: 1px solid #bdc3c7;
                            "
                        >
                            <div
                                style="
                                    width: 110px;
                                    text-align: center;
                                    font-size: 14px;
                                    background: #e9edef;
                                    height: 100%;
                                    line-height: 32px;
                                "
                            >
                                Remote site:
                            </div>
                            <el-autocomplete
                                v-model="remotePath"
                                :fetch-suggestions="queryRemoteSearch"
                                placeholder=""
                                @select="handleRemoteSelect"
                                size="small"
                                style="width: 100%"
                                @change="remotePathChange"
                                class="autocomplete"
                                :disabled="!sftp"
                            >
                                <template slot-scope="{ item }">
                                    {{ item }}
                                </template>
                            </el-autocomplete>
                        </div>
                        <div style="flex: 1; background: #fff">
                            <el-table
                                :data="remoteRowData"
                                :style="{ width: clientWidth / 2 + 'px', overflow: 'auto' }"
                                :height="clientHeight - 360"
                                @cell-dblclick="remoteRowDoubleClicked"
                                @row-contextmenu="remoteRowContextmenu"
                                border
                                highlight-selection-row
                                @selection-change="handleSelectionChange"
                                ref="remoteMultipleTable"
                                @row-click="handleRemoteRowClick"
                                row-key="name"
                                @sort-change="remoteSortChange"
                                :row-class-name="tableRowClassName"
                            >
                                <template slot="empty">
                                    <div style="height: 100%">
                                        <el-empty description="Not connected to any server"></el-empty>
                                    </div>
                                </template>
                                <el-table-column
                                    prop="name"
                                    label="Name"
                                    :show-overflow-tooltip="true"
                                    sortable="custom"
                                >
                                    <template slot-scope="scope">
                                        <div style="display: flex; align-items: center">
                                            <img
                                                :src="require('@/assets/folder.png')"
                                                width="20px"
                                                height="20px"
                                                v-if="scope.row.kind === 'folder' || scope.row.kind === ''"
                                            />
                                            <svg
                                                viewBox="0 0 1024 1024"
                                                version="1.1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                v-if="scope.row.kind === 'file'"
                                            >
                                                <path
                                                    d="M637.194862 113.714901l0 189.396581 182.346001 0L649.150148 113.714901 637.194862 113.714901zM816.682769 896.959605c6.27696-6.275937 10.255575-14.8318 10.255575-24.52865L826.938344 355.018689l-195.461717 0 0 0c-12.534478 0-24.489764-5.13802-32.467459-13.693884l0 0c-8.555863-7.985882-13.674441-19.391652-13.674441-32.515554L585.334727 113.714901 229.169935 113.714901l0 0c-9.685593 0-18.232247 3.418866-24.498974 9.69685-6.26775 6.27696-9.69685 14.832823-9.69685 24.529673l0 0 0 724.489532 0 0c0 9.69685 3.429099 18.252713 9.69685 24.52865 6.26775 6.277984 14.813381 10.276041 24.498974 10.276041l0 0 563.02307 0 0 0C801.868365 907.235646 810.425252 903.236566 816.682769 896.959605L816.682769 896.959605zM229.169935 61.798485l442.211541 0 2.838651 0 1.719154 1.708921L876.518552 284.850583l1.720178 1.719154 0 2.278903 0 583.583338c0 23.968901-9.69685 45.639456-25.071002 61.051471l0 0c-15.392572 15.393595-37.044708 25.090445-60.974723 25.090445l0 0-563.02307 0 0 0c-23.360034 0-45.02138-9.69685-60.974723-25.090445-15.383362-15.413038-25.069979-37.08257-25.069979-61.051471L143.125233 147.941424c0-23.38971 9.686616-45.070498 25.069979-61.043285C184.148555 71.494311 205.809901 61.798485 229.169935 61.798485L229.169935 61.798485z"
                                                    fill="#E4E7ED"
                                                ></path>
                                            </svg>
                                            <svg
                                                viewBox="0 0 1024 1024"
                                                version="1.1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                v-if="scope.row.kind === 'link'"
                                            >
                                                <path
                                                    d="M399.432624 72.624113h551.943263v326.808511H399.432624z"
                                                    fill="#ffca27"
                                                ></path>
                                                <path
                                                    d="M0 660.879433h1024v326.80851c0 20.051518-16.376738 36.312057-36.573504 36.312057H36.573504C16.376738 1024 0 1007.739461 0 987.687943V660.879433z"
                                                    fill="#ffca27"
                                                ></path>
                                                <path
                                                    d="M36.573504 0h402.286751l219.426497 294.12766H1024V588.255319H0V36.762326C0 16.463887 16.376738 0 36.573504 0z"
                                                    fill="#ffca27"
                                                ></path>
                                                <path d="M0 363.120567h1024v588.25532H0z" fill="#ffca27"></path>
                                                <path
                                                    d="M449.456113 669.507177a73.379404 73.379404 0 0 1-56.378099 26.326241C352.46661 695.833418 319.546099 662.905645 319.546099 622.294241c0-40.604142 32.920511-73.531915 73.531915-73.531915 17.851007 0 34.220482 6.369135 46.958752 16.950468l126.024624-91.019801a49.021277 49.021277 0 1 1 21.53305 29.804936L461.569816 595.495943a73.902298 73.902298 0 0 1 3.703829 40.814752l140.288 66.806922a61.280227 61.280227 0 1 1-15.810269 33.18922l-140.302525-66.814185z"
                                                    fill="#ffffff"
                                                ></path>
                                            </svg>
                                            <div style="margin-left: 5px">{{ scope.row.name }}</div>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="size"
                                    label="Size"
                                    width="90"
                                    sortable="custom"
                                    :formatter="sizeFormatter"
                                >
                                </el-table-column>
                                <el-table-column prop="kind" label="Kind" width="80" sortable="custom">
                                </el-table-column>
                                <el-table-column
                                    prop="modifiedTime"
                                    label="Last modified"
                                    width="150"
                                    sortable="custom"
                                >
                                </el-table-column>
                                <el-table-column prop="permissions" label="Permissions" width="120" sortable="custom">
                                </el-table-column>
                            </el-table>
                            <ul
                                v-if="isRemoteMenuVisible"
                                :style="{
                                    top: menuTop + 'px',
                                    left: menuLeft + 'px',
                                    background: '#f7f9fa',
                                    color: '#303133'
                                }"
                            >
                                <li @click="menuRemoteAction('download')" style="width: 250px">
                                    <span>Download</span>
                                </li>
                                <!-- <li @click="menuRemoteAction('Create directory')" style="width: 250px">
                                    <span>Create directory</span>
                                </li>
                                <li @click="menuRemoteAction('Create directory and enter it')" style="width: 250px">
                                    <span>Create directory and enter it</span>
                                </li> -->
                                <li @click="menuRemoteAction('refresh')" style="width: 250px">
                                    <span>Refresh</span>
                                </li>
                                <li @click="menuRemoteAction('delete')" style="width: 250px">
                                    <span>Delete</span>
                                </li>
                                <!-- <li @click="menuRemoteAction('rename')" style="width: 250px">
                                    <span>Rename</span>
                                </li>
                                <li @click="menuRemoteAction('File permissions')" style="width: 250px">
                                    <span>File permissions...</span>
                                </li> -->
                            </ul>
                        </div>
                    </div>
                </div>
                <div style="height: 200px">
                    <el-tabs type="border-card" v-model="transfers" class="transfers">
                        <el-tab-pane
                            :label="queuedFiles === 0 ? 'Queued files' : 'Queued files (' + queuedFiles + ')'"
                            name="queuedFiles"
                        >
                            <el-table
                                :data="queuedFilesList"
                                style="width: 100%; overflow: auto"
                                height="170"
                                border
                                highlight-current-row
                                empty-text=" "
                            >
                                <el-table-column label="Server/Local file" prop="local" :show-overflow-tooltip="true">
                                </el-table-column>
                                <el-table-column label="Direction" prop="direction" width="80" align="center">
                                </el-table-column>
                                <el-table-column label="Remote file" prop="remote" :show-overflow-tooltip="true">
                                </el-table-column>
                                <el-table-column label="Size" prop="size" width="136"> </el-table-column>
                                <el-table-column label="Progress" prop="progress" width="160">
                                    <template slot-scope="scope">
                                        <el-progress
                                            :text-inside="true"
                                            :stroke-width="18"
                                            :percentage="scope.row.progress"
                                            status="success"
                                        ></el-progress>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane
                            :label="
                                failedTransfers === 0
                                    ? 'Failed transfers'
                                    : 'Failed transfers (' + failedTransfers + ')'
                            "
                            name="failedTransfers"
                        >
                            <el-table
                                :data="failedTransfersList"
                                style="width: 100%; overflow: auto"
                                height="170"
                                border
                                highlight-current-row
                                empty-text=" "
                            >
                                <el-table-column label="Server/Local file" prop="local" :show-overflow-tooltip="true">
                                </el-table-column>
                                <el-table-column label="Direction" prop="direction" width="80" align="center">
                                </el-table-column>
                                <el-table-column label="Remote file" prop="remote" :show-overflow-tooltip="true">
                                </el-table-column>
                                <el-table-column label="Size" prop="size" width="136"> </el-table-column>
                                <el-table-column label="Time" prop="time" width="150"> </el-table-column>
                                <el-table-column label="Reason" prop="reason"> </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane
                            :label="
                                successfulTransfers === 0
                                    ? 'Successful transfers'
                                    : 'Successful transfers (' + successfulTransfers + ')'
                            "
                            name="suceessfulTransfers"
                        >
                            <el-table
                                :data="successfulTransfersList"
                                style="width: 100%; overflow: auto"
                                height="170"
                                border
                                highlight-current-row
                                empty-text=" "
                            >
                                <el-table-column label="Server/Local file" prop="local" :show-overflow-tooltip="true">
                                </el-table-column>
                                <el-table-column label="Direction" prop="direction" width="80" align="center">
                                </el-table-column>
                                <el-table-column label="Remote file" prop="remote" :show-overflow-tooltip="true">
                                </el-table-column>
                                <el-table-column label="Size" prop="size" width="136"> </el-table-column>
                                <el-table-column label="Time" prop="time" width="150"> </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
        <div v-show="classify === 'Sessions'">
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
                        height: clientHeight - 60 + 'px',
                        overflow: 'auto',
                        padding: '6px',
                        'border-radius': '8px',
                        margin: '0px 10px 10px 0px',
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
                        <div :style="{ height: clientHeight - 170 + 'px', overflow: 'auto' }">
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
                                @contextmenu.prevent="showSnippetMenu($event, index)"
                            >
                                <div style="display: flex; align-items: center">
                                    <div
                                        style="flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                                    >
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
                                    style="
                                        white-space: nowrap;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        margin-top: 8px;
                                    "
                                >
                                    {{ item.script }}
                                </div>
                            </div>
                            <ul
                                v-if="isSnippetMenuVisible"
                                :style="{
                                    top: menuTop + 'px',
                                    left: menuLeft + 'px',
                                    background: theme.background,
                                    color: theme.foreground
                                }"
                            >
                                <li @click="menuSnippetAction('edit')">Edit</li>
                                <li @click="menuSnippetAction('delete')">Delete</li>
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
                            <el-form ref="snippetForm" :model="snippetForm" :rules="snippetRules" label-width="0px">
                                <el-form-item prop="name">
                                    <el-input
                                        v-model="snippetForm.name"
                                        placeholder="Action description"
                                        class="snippetLable"
                                    ></el-input>
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
                            <el-form ref="snippetForm" :model="snippetForm" :rules="snippetRules" label-width="0px">
                                <el-form-item prop="name">
                                    <el-input
                                        v-model="snippetForm.name"
                                        placeholder="Action description"
                                        class="snippetLable"
                                    ></el-input>
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
                                        'border-radius': '8px',
                                        display: 'flex',
                                        'justify-content': 'center',
                                        'align-items': 'center'
                                    }"
                                >
                                    <i
                                        class="el-icon-sunny"
                                        :style="{ color: item.foreground, 'font-size': '22px' }"
                                        v-if="item.type === 'light'"
                                    ></i>
                                    <i
                                        class="el-icon-moon"
                                        :style="{ color: item.foreground, 'font-size': '22px' }"
                                        v-else
                                    ></i>
                                </div>
                                <div style="margin-left: 10px; font-size: 13px">{{ key }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="Info" :visible.sync="showAddSession" width="500px" :close-on-click-modal="false">
            <el-form ref="sessionForm" :model="sessionForm" :rules="sessionRules">
                <el-form-item label="Host Name(or IP address)" prop="host">
                    <el-input v-model="sessionForm.host" clearable></el-input>
                </el-form-item>
                <el-form-item label="Username" prop="username">
                    <el-input v-model="sessionForm.username" clearable></el-input>
                </el-form-item>
                <el-form-item label="Password" prop="password">
                    <el-input v-model="sessionForm.password" show-password clearable></el-input>
                </el-form-item>
                <el-form-item label="Port" prop="port">
                    <el-input v-model.number="sessionForm.port"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showAddSession = false">Cancel</el-button>
                <el-button type="primary" @click="handleSaveSession">Connect</el-button>
            </span>
        </el-dialog>
        <el-dialog title="Info" :visible.sync="showEditSession" width="500px" :close-on-click-modal="false">
            <el-form ref="sessionForm" :model="sessionForm" :rules="sessionRules">
                <el-form-item label="Label">
                    <el-input v-model="sessionForm.label" clearable></el-input>
                </el-form-item>
                <el-form-item label="Host Name(or IP address)" prop="host">
                    <el-input v-model="sessionForm.host" clearable></el-input>
                </el-form-item>
                <el-form-item label="Username" prop="username">
                    <el-input v-model="sessionForm.username" clearable></el-input>
                </el-form-item>
                <el-form-item label="Password" prop="password">
                    <el-input v-model="sessionForm.password" show-password clearable></el-input>
                </el-form-item>
                <el-form-item label="Port" prop="port">
                    <el-input v-model.number="sessionForm.port"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showEditSession = false">Cancel</el-button>
                <el-button type="primary" @click="handleUpdateSession">Confirm</el-button>
            </span>
        </el-dialog>
        <el-dialog title="Activate License" :visible.sync="licenseVisible" center>
            <div style="margin-top: 20px">
                <el-input placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" v-model="licenseKey" clearable> </el-input>
            </div>
            <span slot="footer" class="dialog-footer" style="margin-top: 20px">
                <el-button type="primary" size="medium" @click="handleLicenseKey">Activate</el-button>
            </span>
        </el-dialog>
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
import { filesize } from 'filesize'
import pLimit from 'p-limit'
const dayjs = require('dayjs')
const path = require('path')
const { Client } = require('ssh2')
var shell = require('shelljs')
const fs = require('fs')
var Mode = require('stat-mode')

export default {
    data() {
        return {
            classify: 'Hosts',
            clientWidth: document.documentElement.clientWidth || document.body.clientWidth,
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            mainBackground: '#353951',
            auxBackgroudColor: '#edf1f2',
            activeName: '',
            tabs: {},
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
            snippetRules: {
                name: [{ required: true, message: 'Action description', trigger: 'blur' }],
                script: [{ required: true, message: 'Action Script', trigger: 'blur' }]
            },
            showAddSnippet: false,
            showEditSnippet: false,
            index: -1,
            isSnippetMenuVisible: false,
            isSessionMenuVisible: false,
            menuTop: 0,
            menuLeft: 0,
            showAddSession: false,
            sessionForm: {
                label: '',
                host: '',
                username: '',
                password: '',
                port: 22
            },
            sessionRules: {
                host: [{ required: true, message: 'Host Name(or IP address)', trigger: 'blur' }],
                username: [{ required: true, message: 'Username', trigger: 'blur' }],
                password: [{ required: true, message: 'Password', trigger: 'blur' }],
                port: [
                    { required: true, message: 'Port', trigger: 'blur' },
                    { type: 'integer', message: 'Port must be a integer value', trigger: 'blur' },
                    { type: 'integer', min: 0, max: 65535, message: 'Port Range 0 to 65535', trigger: 'blur' }
                ]
            },
            sessionList: [],
            showEditSession: false,
            localRowData: [],
            remoteRowData: [],
            search: '',
            localPath: '',
            remotePath: '',
            localOptions: [],
            remoteOptions: ['/root'],
            transfers: 'queuedFiles',
            queuedFiles: 0,
            failedTransfers: 0,
            successfulTransfers: 0,
            queuedFilesObject: {},
            failedTransfersObject: {},
            successfulTransfersObject: {},
            queuedFilesList: [],
            failedTransfersList: [],
            successfulTransfersList: [],
            conn: null,
            sftp: null,
            curLocalPath: '',
            curRemotePath: '',
            isLocalMenuVisible: false,
            isRemoteMenuVisible: false,
            selectedRows: [],
            limit: null,
            isPay: false,
            licenseVisible: false,
            licenseKey: ''
        }
    },
    mounted() {
        this.isPay = localStorage.getItem('isPay') || false
        let themeName = localStorage.getItem('theme') || 'Monokai'
        localStorage.setItem('theme', themeName)
        let settingFlag = localStorage.getItem('settingFlag')
        if (settingFlag == 'false') {
            this.settingFlag = false
        } else {
            this.settingFlag = true
        }
        this.theme = this.themes[themeName]
        window.ipcRenderer.on('terminal', (event, name, data) => {
            let item = this.tabs[name]
            if (item) {
                item.xterm.write(data)
            }
        })
        window.ipcRenderer.on('close', event => {
            for (const key in this.tabs) {
                let item = this.tabs[key]
                tab.fitAddon.dispose()
                tab.clipboardAddon.dispose()
                tab.searchAddon.dispose()
                tab.webLinksAddon.dispose()
                tab.xterm.dispose(this.$refs[tab.name])
                if (tab.protocol === 'ssh') {
                    tab.stream.close()
                }
            }
        })
        window.addEventListener('resize', () => {
            this.clientWidth = document.documentElement.clientWidth || document.body.clientWidth
            this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight
            for (const key in this.tabs) {
                this.$nextTick(() => {
                    let item = this.tabs[key]
                    item.fitAddon.fit()
                    if (item.protocol === 'shell') {
                        window.ipcRenderer.invoke('resize', key, item.xterm.rows, item.xterm.cols)
                    } else if (item.protocol === 'ssh') {
                        item.stream.setWindow(item.xterm.rows, item.xterm.cols)
                    }
                })
            }
        })
        this.querySnippetAll()
        this.querySessionAll()
        this.getHome()
    },
    methods: {
        sizeFormatter(row, column) {
            return row.kind === 'file' ? filesize(row.size, { standard: 'jedec' }) : ''
        },
        localSortChange({ column, prop, order }) {
            this.localRowData = this.localRowData.filter(item => {
                return item.name !== '..'
            })
            if (order === 'ascending') {
                if (prop === 'name') {
                    this.localRowData.sort((a, b) => a[prop].localeCompare(b[prop], 'zh'))
                } else if (prop === 'modifiedTime') {
                    this.localRowData.sort((a, b) => Date.parse(a[prop]) - Date.parse(b[prop]))
                } else if (prop === 'size') {
                    this.localRowData.sort((a, b) => a[prop] - b[prop])
                } else {
                    this.localRowData.sort((a, b) => a[prop].localeCompare(b[prop], 'zh'))
                }
            } else if (order === 'descending') {
                if (prop === 'name') {
                    this.localRowData.sort((a, b) => b[prop].localeCompare(a[prop], 'zh'))
                } else if (prop === 'modifiedTime') {
                    this.localRowData.sort((a, b) => Date.parse(b[prop]) - Date.parse(a[prop]))
                } else if (prop === 'size') {
                    this.localRowData.sort((a, b) => b[prop] - a[prop])
                } else {
                    this.localRowData.sort((a, b) => b[prop].localeCompare(a[prop], 'zh'))
                }
            }
            this.localRowData.unshift({
                kind: '',
                name: '..'
            })
        },
        remoteSortChange({ column, prop, order }) {
            this.remoteRowData = this.remoteRowData.filter(item => {
                return item.name !== '..'
            })
            if (order === 'ascending') {
                if (prop === 'name') {
                    this.remoteRowData.sort((a, b) => a[prop].localeCompare(b[prop], 'zh'))
                } else if (prop === 'modifiedTime') {
                    this.remoteRowData.sort((a, b) => Date.parse(a[prop]) - Date.parse(b[prop]))
                } else if (prop === 'size') {
                    this.remoteRowData.sort((a, b) => a[prop] - b[prop])
                } else {
                    this.remoteRowData.sort((a, b) => a[prop].localeCompare(b[prop], 'zh'))
                }
            } else if (order === 'descending') {
                if (prop === 'name') {
                    this.remoteRowData.sort((a, b) => b[prop].localeCompare(a[prop], 'zh'))
                } else if (prop === 'modifiedTime') {
                    this.remoteRowData.sort((a, b) => Date.parse(b[prop]) - Date.parse(a[prop]))
                } else if (prop === 'size') {
                    this.remoteRowData.sort((a, b) => b[prop] - a[prop])
                } else {
                    this.remoteRowData.sort((a, b) => b[prop].localeCompare(a[prop], 'zh'))
                }
            }
            this.remoteRowData.unshift({
                kind: '',
                name: '..'
            })
        },
        handleLicenseKey() {
            if (this.licenseKey) {
                const client = new ClientJS()
                const params = {
                    product_id: 'Coast',
                    client_id: client.getFingerprint(),
                    license_code: this.licenseKey
                }
                this.$axios.get('verification_license', { params }).then(res => {
                    if (res.data.code == 200) {
                        this.isPay = true
                        localStorage.setItem('isPay', true)
                        this.licenseVisible = false
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }
        },
        readLocalDirRecursively(dirPath, rootPath) {
            let folderList = []
            let fileList = []
            const list = fs.readdirSync(dirPath, { withFileTypes: true })
            list.forEach(dirent => {
                const fullPath = path.join(dirPath, dirent.name)
                if (dirent.isDirectory()) {
                    folderList.push(fullPath.replace(rootPath, this.curRemotePath).replace(/\\/g, '/'))
                    let result = this.readLocalDirRecursively(fullPath, rootPath)
                    fileList = fileList.concat(result.fileList)
                    folderList = folderList.concat(result.folderList)
                } else {
                    fileList.push(fullPath.replace(rootPath, this.curRemotePath).replace(/\\/g, '/'))
                }
            })
            return { folderList: folderList, fileList: fileList }
        },
        asyncReadDir(dirPath) {
            return new Promise((resolve, reject) => {
                this.sftp.readdir(dirPath, (err, list) => {
                    if (err) reject(err)
                    else resolve(list)
                })
            })
        },
        async readRemoteDirRecursively(dirPath, rootPath) {
            let list = await this.asyncReadDir(dirPath)
            let folderList = []
            let fileList = []
            for (let i = 0; i < list.length; i++) {
                let row = list[i]
                const fullPath = dirPath + '/' + row.filename
                if (row.attrs.isDirectory()) {
                    folderList.push(fullPath.replace(rootPath, this.curLocalPath))
                    let result = await this.readRemoteDirRecursively(fullPath, rootPath)
                    fileList = fileList.concat(result.fileList)
                    folderList = folderList.concat(result.folderList)
                } else {
                    fileList.push(fullPath.replace(rootPath, this.curLocalPath))
                }
            }
            return { folderList: folderList, fileList: fileList }
        },
        handleSelectionChange(selection) {
            this.selectedRows = selection
        },
        tableRowClassName({ row, rowIndex }) {
            row.index = rowIndex
        },
        handleLocalRowClick(row, column, event) {
            this.$refs.remoteMultipleTable.clearSelection()
            if (event.metaKey || event.ctrlKey) {
                const selected = this.selectedRows.includes(row)
                if (selected) {
                    this.selectedRows.splice(row.index, 1)
                    this.$refs.localMultipleTable.toggleRowSelection(row, false)
                } else {
                    this.selectedRows.push({ ...row })
                    this.$refs.localMultipleTable.toggleRowSelection(row, true)
                }
            } else if (event.shiftKey) {
                let selectIndexs = []
                for (let i = 0; i < this.selectedRows.length; i++) {
                    const index = this.localRowData.findIndex(element => element.name === this.selectedRows[i].name)
                    selectIndexs.push(index)
                }
                selectIndexs.sort()
                let minIndex = -1
                let maxIndex = 0
                if (selectIndexs.length === 0) {
                    minIndex = row.index
                    maxIndex = row.index + 1
                } else {
                    if (selectIndexs[0] >= row.index) {
                        minIndex = row.index
                        maxIndex = selectIndexs[0] + 1
                    } else {
                        minIndex = selectIndexs[0]
                        maxIndex = row.index + 1
                    }
                }
                let selectData = this.localRowData.slice(minIndex, maxIndex)
                this.$refs.localMultipleTable.clearSelection()
                for (let i = 0; i < selectData.length; i++) {
                    this.selectedRows.push({ ...selectData[i] })
                    this.$refs.localMultipleTable.toggleRowSelection(selectData[i], true)
                }
            } else {
                this.$refs.localMultipleTable.clearSelection()
                this.$refs.localMultipleTable.toggleRowSelection(row)
            }
        },
        handleRemoteRowClick(row, column, event) {
            this.$refs.localMultipleTable.clearSelection()
            if (event.metaKey || event.ctrlKey) {
                const selected = this.selectedRows.includes(row)
                if (selected) {
                    const index = this.selectedRows.findIndex(d => d.name === row.name)
                    this.selectedRows.splice(index, 1)
                    this.$refs.remoteMultipleTable.toggleRowSelection(row, false)
                } else {
                    this.selectedRows.push({ ...row })
                    this.$refs.remoteMultipleTable.toggleRowSelection(row, true)
                }
            } else if (event.shiftKey) {
                let selectIndexs = []
                for (let i = 0; i < this.selectedRows.length; i++) {
                    const index = this.remoteRowData.findIndex(element => element.name === this.selectedRows[i].name)
                    selectIndexs.push(index)
                }
                selectIndexs.sort()
                let minIndex = -1
                let maxIndex = 0
                if (selectIndexs.length === 0) {
                    minIndex = row.index
                    maxIndex = row.index + 1
                } else {
                    if (selectIndexs[0] >= row.index) {
                        minIndex = row.index
                        maxIndex = selectIndexs[0] + 1
                    } else {
                        minIndex = selectIndexs[0]
                        maxIndex = row.index + 1
                    }
                }
                let selectData = this.remoteRowData.slice(minIndex, maxIndex)
                this.$refs.remoteMultipleTable.clearSelection()
                for (let i = 0; i < selectData.length; i++) {
                    this.selectedRows.push({ ...selectData[i] })
                    this.$refs.remoteMultipleTable.toggleRowSelection(selectData[i], true)
                }
            } else {
                this.$refs.remoteMultipleTable.clearSelection()
                this.$refs.remoteMultipleTable.toggleRowSelection(row)
            }
        },
        mkdirRemoteFolder(newFolderList) {
            return new Promise((resolve, reject) => {
                this.conn.exec('mkdir -p ' + newFolderList.join(' '), (err, stream) => {
                    if (err) {
                        reject()
                    } else {
                        stream
                            .on('close', (code, signal) => {
                                console.log('mkdir :: close')
                                this.updateSftp()
                                resolve()
                            })
                            .on('data', data => {
                                console.log('STDOUT:', data.toString())
                            })
                            .stderr.on('data', data => {
                                console.error('STDERR:', data.toString())
                            })
                    }
                })
            })
        },
        fastPut(localFile, remoteFile, isRefresh) {
            return new Promise((resolve, reject) => {
                let size = ''
                this.sftp.fastPut(
                    localFile,
                    remoteFile,
                    {
                        step: (total_transferred, chunk, total) => {
                            //console.log(total_transferred, chunk, total)
                            size = filesize(total, { standard: 'jedec' })
                            this.queuedFilesObject[localFile] = {
                                local: localFile,
                                remote: remoteFile,
                                direction: '-->>',
                                size: size,
                                progress: Math.floor((total_transferred / total) * 100)
                            }
                            this.queuedFilesList = Object.values(this.queuedFilesObject)
                        }
                    },
                    err => {
                        this.queuedFiles = this.queuedFiles - 1
                        this.$delete(this.queuedFilesObject, localFile)
                        this.queuedFilesList = Object.values(this.queuedFilesObject)
                        if (err) {
                            this.failedTransfers = this.failedTransfers + 1
                            this.failedTransfersObject[localFile] = {
                                local: localFile,
                                remote: remoteFile,
                                direction: '-->>',
                                time: dayjs().format('MM/DD/YYYY HH:mm:ss'),
                                size: size,
                                reason: err.toString()
                            }
                            this.failedTransfersList = Object.values(this.failedTransfersObject)
                            console.error('Upload Error:', err)
                            reject()
                        } else {
                            // console.log('Upload Success:', remoteFile)
                            this.successfulTransfers = this.successfulTransfers + 1
                            this.successfulTransfersObject[localFile] = {
                                local: localFile,
                                remote: remoteFile,
                                direction: '-->>',
                                size: size,
                                time: dayjs().format('MM/DD/YYYY HH:mm:ss')
                            }
                            this.successfulTransfersList = Object.values(this.successfulTransfersObject)
                            if (isRefresh) {
                                if (this.sftp) {
                                    this.sftp.readdir(this.curRemotePath, (err, list) => {
                                        if (err) {
                                            return
                                        }
                                        let remoteRowData = [
                                            {
                                                kind: '',
                                                name: '..'
                                            }
                                        ]
                                        for (let i = 0; i < list.length; i++) {
                                            let row = list[i]
                                            let kind = row.longname.substring(0, 1)
                                            if (kind === '-') {
                                                kind = 'file'
                                            } else if (kind === 'd') {
                                                kind = 'folder'
                                            } else if (kind === 'p') {
                                                kind = 'FIFO'
                                            } else if (kind === 'l') {
                                                kind = 'link'
                                            } else if (kind === 'b') {
                                                kind = 'block'
                                            } else if (kind === 'c') {
                                                kind = 'character'
                                            } else if (kind === 's') {
                                                kind = 'socket'
                                            } else {
                                                kind = 'other'
                                            }
                                            remoteRowData.push({
                                                name: row.filename,
                                                size: kind === 'file' ? row.attrs.size : '',
                                                kind: kind,
                                                modifiedTime: dayjs.unix(row.attrs.mtime).format('MM/DD/YYYY HH:mm:ss'),
                                                permissions: row.longname.substring(0, 11)
                                            })
                                        }
                                        this.remoteRowData = remoteRowData
                                    })
                                }
                            }
                            resolve()
                        }
                    }
                )
            })
        },
        async menuLocalAction(action) {
            if (action === 'upload') {
                const fileLimit = pLimit(2)
                const fileInput = []
                let curRemotePath = this.curRemotePath
                let curLocalPath = this.curLocalPath
                for (let i = 0; i < this.selectedRows.length; i++) {
                    let selectedRow = this.selectedRows[i]
                    if (selectedRow.kind === 'folder') {
                        const result = this.readLocalDirRecursively(
                            path.join(this.curLocalPath, selectedRow.name),
                            this.curLocalPath
                        )
                        let folderList = result.folderList
                        let fileList = result.fileList
                        folderList.unshift(
                            (this.curLocalPath + '/' + selectedRow.name).replace(this.curLocalPath, this.curRemotePath)
                        )
                        let length = Math.ceil(folderList.length / 500)
                        const limit = pLimit(5)
                        const input = []
                        for (let j = 0; j < length; j++) {
                            let newFolderList = folderList.slice(j * 500, (j + 1) * 500)
                            input.push(limit(() => this.mkdirRemoteFolder(newFolderList)))
                        }
                        await Promise.all(input)
                        this.queuedFiles = this.queuedFiles + fileList.length
                        for (let i = 0; i < fileList.length; i++) {
                            this.queuedFilesObject[fileList[i].replace(curRemotePath, curLocalPath)] = {
                                local: fileList[i].replace(curRemotePath, curLocalPath),
                                remote: fileList[i],
                                direction: '-->>',
                                progress: 0
                            }
                            this.queuedFilesList = Object.values(this.queuedFilesObject)
                            let localFile = fileList[i].replace(curRemotePath, curLocalPath)
                            fileInput.push(fileLimit(() => this.fastPut(localFile, fileList[i], false)))
                        }
                    } else if (selectedRow.kind === 'file') {
                        const localFile = path.join(this.curLocalPath, selectedRow.name)
                        const remoteFile = this.curRemotePath + '/' + path.basename(localFile)
                        this.queuedFiles = this.queuedFiles + 1
                        this.queuedFilesObject[localFile] = {
                            local: localFile,
                            remote: remoteFile,
                            direction: '-->>',
                            size: filesize(selectedRow.size, { standard: 'jedec' }),
                            progress: 0
                        }
                        this.queuedFilesList = Object.values(this.queuedFilesObject)
                        fileInput.push(fileLimit(() => this.fastPut(localFile, remoteFile, true)))
                    }
                }
                await Promise.all(fileInput)
                console.log('Upload Success')
            } else if (action === 'delete') {
                for (let i = 0; i < this.selectedRows.length; i++) {
                    let selectedRow = this.selectedRows[i]
                    if (selectedRow.kind === 'folder') {
                        fs.rm(path.join(this.curLocalPath, selectedRow.name), { recursive: true, force: true }, err => {
                            if (err) {
                                console.error('Download Error:', err)
                            } else {
                                let localRowData = this.getLocalDir(this.curLocalPath)
                                if (localRowData.length != 0) {
                                    this.localRowData = localRowData
                                }
                            }
                        })
                    } else if (selectedRow.kind === 'file' || selectedRow.kind === 'link') {
                        try {
                            fs.unlinkSync(path.join(this.curLocalPath, selectedRow.name))
                            let localRowData = this.getLocalDir(this.curLocalPath)
                            if (localRowData.length != 0) {
                                this.localRowData = localRowData
                            }
                            console.log('Delete Success')
                        } catch (err) {
                            console.error('Delete Error:', error)
                        }
                    }
                }
            } else if (action === 'rename') {
            } else if (action === 'refresh') {
                let localRowData = this.getLocalDir(this.curLocalPath)
                if (localRowData.length != 0) {
                    this.localRowData = localRowData
                }
            } else if (action === 'Create directory') {
            } else if (action === 'Create directory and enter it') {
            }
        },
        mkdirLocalFolder(newFolderList) {
            shell.mkdir('-p', newFolderList)
        },
        fastGet(remoteFile, localFile, isRefresh) {
            let size = ''
            return new Promise((resolve, reject) => {
                this.sftp.fastGet(
                    remoteFile,
                    localFile,
                    {
                        step: (total_transferred, chunk, total) => {
                            //console.log(total_transferred, chunk, total)
                            size = filesize(total, { standard: 'jedec' })
                            this.queuedFilesObject[localFile] = {
                                local: localFile,
                                remote: remoteFile,
                                direction: '<<--',
                                size: size,
                                progress: Math.floor((total_transferred / total) * 100)
                            }
                            this.queuedFilesList = Object.values(this.queuedFilesObject)
                        }
                    },
                    err => {
                        this.queuedFiles = this.queuedFiles - 1
                        this.$delete(this.queuedFilesObject, localFile)
                        this.queuedFilesList = Object.values(this.queuedFilesObject)
                        if (err) {
                            this.failedTransfers = this.failedTransfers + 1
                            this.failedTransfersObject[localFile] = {
                                local: localFile,
                                remote: remoteFile,
                                direction: '<<--',
                                time: dayjs().format('MM/DD/YYYY HH:mm:ss'),
                                size: size,
                                reason: err.toString()
                            }
                            this.failedTransfersList = Object.values(this.failedTransfersObject)
                            console.error('Upload Error:', err)
                            reject()
                        } else {
                            // console.log('Upload Success:', localFile)
                            this.successfulTransfers = this.successfulTransfers + 1
                            this.successfulTransfersObject[localFile] = {
                                local: localFile,
                                remote: remoteFile,
                                direction: '<<--',
                                size: size,
                                time: dayjs().format('MM/DD/YYYY HH:mm:ss')
                            }
                            this.successfulTransfersList = Object.values(this.successfulTransfersObject)
                            if (isRefresh) {
                                let localRowData = this.getLocalDir(this.curLocalPath)
                                if (localRowData.length != 0) {
                                    this.localRowData = localRowData
                                }
                            }
                            resolve()
                        }
                    }
                )
            })
        },
        async menuRemoteAction(action) {
            if (action === 'download') {
                const fileLimit = pLimit(2)
                const fileInput = []
                let curRemotePath = this.curRemotePath
                let curLocalPath = this.curLocalPath
                for (let i = 0; i < this.selectedRows.length; i++) {
                    let selectedRow = this.selectedRows[i]
                    if (selectedRow.kind === 'folder') {
                        const result = await this.readRemoteDirRecursively(
                            this.curRemotePath + '/' + selectedRow.name,
                            this.curRemotePath
                        )
                        let folderList = result.folderList
                        let fileList = result.fileList
                        folderList.unshift(
                            (this.curRemotePath + '/' + selectedRow.name).replace(this.curRemotePath, this.curLocalPath)
                        )

                        let length = Math.ceil(folderList.length / 500)
                        const limit = pLimit(5)
                        const input = []
                        for (let j = 0; j < length; j++) {
                            let newFolderList = folderList.slice(j * 500, (j + 1) * 500)
                            input.push(limit(() => this.mkdirLocalFolder(newFolderList)))
                        }
                        await Promise.all(input)
                        let localRowData = this.getLocalDir(this.curLocalPath)
                        if (localRowData.length != 0) {
                            this.localRowData = localRowData
                        }
                        this.queuedFiles = this.queuedFiles + fileList.length
                        for (let i = 0; i < fileList.length; i++) {
                            this.queuedFilesObject[fileList[i]] = {
                                local: fileList[i],
                                remote: fileList[i].replace(curLocalPath, curRemotePath),
                                direction: '<<--',
                                progress: 0
                            }
                            this.queuedFilesList = Object.values(this.queuedFilesObject)
                            let remoteFile = fileList[i].replace(curLocalPath, curRemotePath)
                            fileInput.push(fileLimit(() => this.fastGet(remoteFile, fileList[i]), false))
                        }
                    } else if (selectedRow.kind === 'file') {
                        const remoteFile = this.curRemotePath + '/' + selectedRow.name
                        const localFile = path.join(this.curLocalPath, path.basename(remoteFile))
                        this.queuedFiles = this.queuedFiles + 1
                        this.queuedFilesObject[localFile] = {
                            local: localFile,
                            remote: remoteFile,
                            direction: '<<--',
                            size: filesize(selectedRow.size, { standard: 'jedec' }),
                            progress: 0
                        }
                        this.queuedFilesList = Object.values(this.queuedFilesObject)
                        fileInput.push(fileLimit(() => this.fastGet(remoteFile, localFile, true)))
                    }
                }
                await Promise.all(fileInput)
                console.log('Upload Success')
            } else if (action === 'delete') {
                for (let i = 0; i < this.selectedRows.length; i++) {
                    let selectedRow = this.selectedRows[i]
                    if (selectedRow.kind === 'folder') {
                        this.conn.exec('rm -rf ' + this.curRemotePath + '/' + selectedRow.name, (err, stream) => {
                            if (err) throw err
                            stream
                                .on('close', (code, signal) => {
                                    this.updateSftp()
                                })
                                .on('data', data => {
                                    t
                                    console.log('STDOUT:', data.toString())
                                })
                                .stderr.on('data', data => {
                                    console.error('STDERR:', data.toString())
                                })
                        })
                    } else if (selectedRow.kind === 'file' || selectedRow.kind === 'link') {
                        this.sftp.unlink(this.curRemotePath + '/' + selectedRow.name, err => {
                            if (err) {
                                console.error('Delete Error:', err)
                            } else {
                                this.updateSftp()
                                console.log('Delete Success')
                            }
                        })
                    }
                }
            } else if (action === 'rename') {
            } else if (action === 'refresh') {
                this.updateSftp()
            } else if (action === 'Create directory') {
            } else if (action === 'Create directory and enter it') {
            } else if (action === 'File permissions') {
            }
        },
        updateSftp() {
            if (this.sftp) {
                this.sftp.readdir(this.curRemotePath, (err, list) => {
                    if (err) {
                        return
                    }
                    let remoteRowData = [
                        {
                            kind: '',
                            name: '..'
                        }
                    ]
                    for (let i = 0; i < list.length; i++) {
                        let row = list[i]
                        let kind = row.longname.substring(0, 1)
                        if (kind === '-') {
                            kind = 'file'
                        } else if (kind === 'd') {
                            kind = 'folder'
                        } else if (kind === 'p') {
                            kind = 'FIFO'
                        } else if (kind === 'l') {
                            kind = 'link'
                        } else if (kind === 'b') {
                            kind = 'block'
                        } else if (kind === 'c') {
                            kind = 'character'
                        } else if (kind === 's') {
                            kind = 'socket'
                        } else {
                            kind = 'other'
                        }
                        remoteRowData.push({
                            name: row.filename,
                            size: kind === 'file' ? row.attrs.size : '',
                            kind: kind,
                            modifiedTime: dayjs.unix(row.attrs.mtime).format('MM/DD/YYYY HH:mm:ss'),
                            permissions: row.longname.substring(0, 11)
                        })
                    }
                    this.remoteRowData = remoteRowData
                })
            }
        },
        localRowContextmenu(row, column, event) {
            event.preventDefault()
            if (row.kind != '') {
                this.isLocalMenuVisible = true
                this.isRemoteMenuVisible = false
                this.menuTop = event.clientY
                this.menuLeft = event.clientX
            }
        },
        remoteRowContextmenu(row, column, event) {
            event.preventDefault()
            if (row.kind != '') {
                this.isRemoteMenuVisible = true
                this.isLocalMenuVisible = false
                this.menuTop = event.clientY
                this.menuLeft = event.clientX
            }
        },
        getLocalDir(directoryPath) {
            let result = [
                {
                    kind: '',
                    name: '..'
                }
            ]
            try {
                let files = fs.readdirSync(directoryPath)
                for (let i = 0; i < files.length; i++) {
                    let file = files[i]
                    try {
                        let stat = fs.lstatSync(path.join(directoryPath, file))
                        var mode = new Mode(stat)
                        let permissions = mode.toString()
                        let kind = permissions.substring(0, 1)
                        if (kind === '-') {
                            kind = 'file'
                        } else if (kind === 'd') {
                            kind = 'folder'
                        } else if (kind === 'p') {
                            kind = 'FIFO'
                        } else if (kind === 'l') {
                            kind = 'link'
                        } else if (kind === 'b') {
                            kind = 'block'
                        } else if (kind === 'c') {
                            kind = 'character'
                        } else if (kind === 's') {
                            kind = 'socket'
                        } else {
                            kind = 'other'
                        }
                        result.push({
                            name: file,
                            size: kind === 'file' ? stat.size : '',
                            kind: kind,
                            modifiedTime: dayjs(stat.mtimeMs).format('MM/DD/YYYY HH:mm:ss')
                        })
                    } catch (err) {
                        console.log(err)
                    }
                }
            } catch (error) {
                result = []
            }
            return result
        },
        async getHome() {
            if (os.platform() === 'win32') {
                let drives = await window.ipcRenderer.invoke('getHome')
                this.localPath = drives[0]
                this.localOptions = drives
            } else {
                this.localPath = await window.ipcRenderer.invoke('getHome')
                this.localOptions.push(this.localPath)
            }
            this.curLocalPath = this.localPath
            let localRowData = [
                {
                    kind: '',
                    name: '..'
                }
            ]
            shell.ls('-lA', [this.localPath]).forEach(file => {
                var mode = new Mode(file)
                let permissions = mode.toString()
                let kind = permissions.substring(0, 1)
                if (kind === '-') {
                    kind = 'file'
                } else if (kind === 'd') {
                    kind = 'folder'
                } else if (kind === 'p') {
                    kind = 'FIFO'
                } else if (kind === 'l') {
                    kind = 'link'
                } else if (kind === 'b') {
                    kind = 'block'
                } else if (kind === 'c') {
                    kind = 'character'
                } else if (kind === 's') {
                    kind = 'socket'
                } else {
                    kind = 'other'
                }
                localRowData.push({
                    name: file.name,
                    size: kind === 'file' ? file.size : '',
                    kind: kind,
                    modifiedTime: dayjs(file.mtimeMs).format('MM/DD/YYYY HH:mm:ss')
                })
            })
            this.localRowData = localRowData
        },
        querySearch(queryString, cb) {
            var sessions = this.sessionList
            var results = queryString ? sessions.filter(this.createFilter(queryString)) : sessions
            cb(results)
        },
        createFilter(queryString) {
            return session => {
                return (
                    session.label.toLowerCase().indexOf(queryString.toLowerCase()) === 0 ||
                    session.host.toLowerCase().indexOf(queryString.toLowerCase()) === 0
                )
            }
        },
        queryLocalSearch(queryString, cb) {
            cb(this.localOptions)
        },
        queryRemoteSearch(queryString, cb) {
            cb(this.remoteOptions)
        },
        handleSelect(item) {
            let load = this.$loading({
                lock: true,
                text: 'Connect...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.3)'
            })
            this.conn = new Client()
            this.conn
                .on('ready', () => {
                    console.log('Client :: ready')
                    this.conn.sftp((err, sftp) => {
                        if (err) throw err
                        this.search = item.host
                        this.sftp = sftp
                        this.remotePath = '/root'
                        this.curRemotePath = '/root'
                        this.sftp.readdir(this.curRemotePath, (err, list) => {
                            if (err) throw err
                            let remoteRowData = [
                                {
                                    kind: '',
                                    name: '..'
                                }
                            ]
                            for (let i = 0; i < list.length; i++) {
                                let row = list[i]
                                // isBlockDevice()
                                // isCharacterDevice()
                                // isDirectory()
                                // isFIFO()
                                // isFile()
                                // isSocket()
                                let kind = row.longname.substring(0, 1)
                                if (kind === '-') {
                                    kind = 'file'
                                } else if (kind === 'd') {
                                    kind = 'folder'
                                } else if (kind === 'p') {
                                    kind = 'FIFO'
                                } else if (kind === 'l') {
                                    kind = 'link'
                                } else if (kind === 'b') {
                                    kind = 'block'
                                } else if (kind === 'c') {
                                    kind = 'character'
                                } else if (kind === 's') {
                                    kind = 'socket'
                                } else {
                                    kind = 'other'
                                }
                                remoteRowData.push({
                                    name: row.filename,
                                    size: kind === 'file' ? row.attrs.size : '',
                                    kind: kind,
                                    modifiedTime: dayjs.unix(row.attrs.mtime).format('MM/DD/YYYY HH:mm:ss'),
                                    permissions: row.longname.substring(0, 11)
                                })
                            }
                            this.remoteRowData = remoteRowData
                            load.close()
                        })
                    })
                })
                .on('close', () => {
                    console.log('Conn :: close')
                })
                .on('error', error => {
                    this.$message.error(error)
                    load.close()
                })
                .connect({
                    host: item.host,
                    port: item.port,
                    username: item.username,
                    password: item.password
                })
        },
        handleLocalSelect(selectPath) {
            let localRowData = this.getLocalDir(selectPath)
            if (localRowData.length != 0) {
                this.localRowData = localRowData
                this.curLocalPath = selectPath
                this.localPath = selectPath
            }
        },
        localPathChange() {
            let localRowData = this.getLocalDir(this.localPath)
            if (localRowData.length != 0) {
                this.localRowData = localRowData
                this.curLocalPath = this.localPath
                if (!this.localOptions.includes(this.localPath)) {
                    this.localOptions.push(this.localPath)
                }
            }
        },
        handleRemoteSelect(selectPath) {
            if (this.sftp) {
                this.sftp.readdir(selectPath, (err, list) => {
                    if (err) {
                        return
                    }
                    let remoteRowData = [
                        {
                            kind: '',
                            name: '..'
                        }
                    ]
                    for (let i = 0; i < list.length; i++) {
                        let row = list[i]
                        let kind = row.longname.substring(0, 1)
                        if (kind === '-') {
                            kind = 'file'
                        } else if (kind === 'd') {
                            kind = 'folder'
                        } else if (kind === 'p') {
                            kind = 'FIFO'
                        } else if (kind === 'l') {
                            kind = 'link'
                        } else if (kind === 'b') {
                            kind = 'block'
                        } else if (kind === 'c') {
                            kind = 'character'
                        } else if (kind === 's') {
                            kind = 'socket'
                        } else {
                            kind = 'other'
                        }
                        remoteRowData.push({
                            name: row.filename,
                            size: kind === 'file' ? row.attrs.size : '',
                            kind: kind,
                            modifiedTime: dayjs.unix(row.attrs.mtime).format('MM/DD/YYYY HH:mm:ss'),
                            permissions: row.longname.substring(0, 11)
                        })
                    }
                    this.remoteRowData = remoteRowData
                    this.curRemotePath = selectPath
                    this.remotePath = selectPath
                })
            }
        },
        localRowDoubleClicked(row, column, cell, event) {
            if (row.kind === 'folder') {
                this.curLocalPath = path.join(this.curLocalPath, row.name)
                this.localPath = path.dirname(path.join(this.curLocalPath, row.name))
                let localRowData = [
                    {
                        kind: '',
                        name: '..'
                    }
                ]
                shell.ls('-lA', [this.curLocalPath]).forEach(file => {
                    var mode = new Mode(file)
                    let permissions = mode.toString()
                    let kind = permissions.substring(0, 1)
                    if (kind === '-') {
                        kind = 'file'
                    } else if (kind === 'd') {
                        kind = 'folder'
                    } else if (kind === 'p') {
                        kind = 'FIFO'
                    } else if (kind === 'l') {
                        kind = 'link'
                    } else if (kind === 'b') {
                        kind = 'block'
                    } else if (kind === 'c') {
                        kind = 'character'
                    } else if (kind === 's') {
                        kind = 'socket'
                    } else {
                        kind = 'other'
                    }
                    localRowData.push({
                        name: file.name,
                        size: kind === 'file' ? file.size : '',
                        kind: kind,
                        modifiedTime: dayjs(file.mtimeMs).format('MM/DD/YYYY HH:mm:ss')
                    })
                })
                this.localRowData = localRowData
            } else if (row.kind === '') {
                this.curLocalPath = path.dirname(this.curLocalPath)
                this.localPath = this.curLocalPath
                let localRowData = [
                    {
                        kind: '',
                        name: '..'
                    }
                ]
                shell.ls('-lA', [this.curLocalPath]).forEach(file => {
                    var mode = new Mode(file)
                    let permissions = mode.toString()
                    let kind = permissions.substring(0, 1)
                    if (kind === '-') {
                        kind = 'file'
                    } else if (kind === 'd') {
                        kind = 'folder'
                    } else if (kind === 'p') {
                        kind = 'FIFO'
                    } else if (kind === 'l') {
                        kind = 'link'
                    } else if (kind === 'b') {
                        kind = 'block'
                    } else if (kind === 'c') {
                        kind = 'character'
                    } else if (kind === 's') {
                        kind = 'socket'
                    } else {
                        kind = 'other'
                    }
                    localRowData.push({
                        name: file.name,
                        size: kind === 'file' ? file.size : '',
                        kind: kind,
                        modifiedTime: dayjs(file.mtimeMs).format('MM/DD/YYYY HH:mm:ss')
                    })
                })
                this.localRowData = localRowData
            }
        },
        remoteRowDoubleClicked(row, column, cell, event) {
            if (row.kind === 'folder') {
                this.curRemotePath = this.curRemotePath + '/' + row.name
                this.remotePath = path.dirname(this.curRemotePath + '/' + row.name)
                this.sftp.readdir(this.curRemotePath, (err, list) => {
                    if (err) {
                        return
                    }
                    let remoteRowData = [
                        {
                            kind: '',
                            name: '..'
                        }
                    ]
                    for (let i = 0; i < list.length; i++) {
                        let row = list[i]
                        let kind = row.longname.substring(0, 1)
                        if (kind === '-') {
                            kind = 'file'
                        } else if (kind === 'd') {
                            kind = 'folder'
                        } else if (kind === 'p') {
                            kind = 'FIFO'
                        } else if (kind === 'l') {
                            kind = 'link'
                        } else if (kind === 'b') {
                            kind = 'block'
                        } else if (kind === 'c') {
                            kind = 'character'
                        } else if (kind === 's') {
                            kind = 'socket'
                        } else {
                            kind = 'other'
                        }
                        remoteRowData.push({
                            name: row.filename,
                            size: kind === 'file' ? row.attrs.size : '',
                            kind: kind,
                            modifiedTime: dayjs.unix(row.attrs.mtime).format('MM/DD/YYYY HH:mm:ss'),
                            permissions: row.longname.substring(0, 11)
                        })
                    }
                    this.remoteRowData = remoteRowData
                })
            } else if (row.kind === '') {
                this.curRemotePath = path.dirname(this.curRemotePath)
                this.remotePath = this.curRemotePath
                this.sftp.readdir(this.curRemotePath, (err, list) => {
                    if (err) {
                        return
                    }
                    let remoteRowData = [
                        {
                            kind: '',
                            name: '..'
                        }
                    ]
                    for (let i = 0; i < list.length; i++) {
                        let row = list[i]
                        let kind = row.longname.substring(0, 1)
                        if (kind === '-') {
                            kind = 'file'
                        } else if (kind === 'd') {
                            kind = 'folder'
                        } else if (kind === 'p') {
                            kind = 'FIFO'
                        } else if (kind === 'l') {
                            kind = 'link'
                        } else if (kind === 'b') {
                            kind = 'block'
                        } else if (kind === 'c') {
                            kind = 'character'
                        } else if (kind === 's') {
                            kind = 'socket'
                        } else {
                            kind = 'other'
                        }
                        remoteRowData.push({
                            name: row.filename,
                            size: kind === 'file' ? row.attrs.size : '',
                            kind: kind,
                            modifiedTime: dayjs.unix(row.attrs.mtime).format('MM/DD/YYYY HH:mm:ss'),
                            permissions: row.longname.substring(0, 11)
                        })
                    }
                    this.remoteRowData = remoteRowData
                })
            }
        },
        remotePathChange() {
            if (this.sftp) {
                this.sftp.readdir(this.remotePath, (err, list) => {
                    if (err) {
                        return
                    }
                    let remoteRowData = [
                        {
                            kind: '',
                            name: '..'
                        }
                    ]
                    for (let i = 0; i < list.length; i++) {
                        let row = list[i]
                        let kind = row.longname.substring(0, 1)
                        if (kind === '-') {
                            kind = 'file'
                        } else if (kind === 'd') {
                            kind = 'folder'
                        } else if (kind === 'p') {
                            kind = 'FIFO'
                        } else if (kind === 'l') {
                            kind = 'link'
                        } else if (kind === 'b') {
                            kind = 'block'
                        } else if (kind === 'c') {
                            kind = 'character'
                        } else if (kind === 's') {
                            kind = 'socket'
                        } else {
                            kind = 'other'
                        }
                        remoteRowData.push({
                            name: row.filename,
                            size: kind === 'file' ? row.attrs.size : '',
                            kind: kind,
                            modifiedTime: dayjs.unix(row.attrs.mtime).format('MM/DD/YYYY HH:mm:ss'),
                            permissions: row.longname.substring(0, 11)
                        })
                    }
                    this.remoteRowData = remoteRowData
                    this.curRemotePath = this.remotePath
                    if (!this.remoteOptions.includes(this.remotePath)) {
                        this.remoteOptions.push(this.remotePath)
                    }
                })
            }
        },
        handleClick() {
            this.isSnippetMenuVisible = false
            this.isSessionMenuVisible = false
            this.isLocalMenuVisible = false
            this.isRemoteMenuVisible = false
        },
        showSessionMenu(event, index) {
            this.index = index
            this.isSessionMenuVisible = true
            this.menuTop = event.clientY
            this.menuLeft = event.clientX
        },
        menuSessionAction(action) {
            this.isSnippetMenuVisible = false
            if (action === 'remove') {
                let session = this.sessionList[this.index]
                this.handleDeleteSession(session.id)
                this.sessionList.splice(this.index, 1)
            } else if (action === 'edit') {
                let session = this.sessionList[this.index]
                this.sessionForm = Object.assign({}, JSON.parse(JSON.stringify(session)))
                this.showEditSession = true
                if (this.$refs.sessionForm) {
                    this.$refs.sessionForm.resetFields()
                }
            }
        },
        async handleDeleteSession(id) {
            let sql = 'DELETE FROM session WHERE id = ?'
            let result = await window.ipcRenderer.invoke('db_delete', sql, [id])
        },
        dblclick(item) {
            let load = this.$loading({
                lock: true,
                text: 'Connect...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.3)'
            })
            const conn = new Client()
            conn.on('ready', () => {
                load.close()
                console.log('Client :: ready')

                this.addTab('ssh', item.host, conn)
            })
                .on('close', () => {
                    console.log('Conn :: close')
                })
                .on('error', error => {
                    this.$message.error(error)
                    load.close()
                })
                .connect({
                    host: item.host,
                    port: item.port,
                    username: item.username,
                    password: item.password
                })
        },
        handleCommand(command) {
            if (command === 'shell') {
                this.addTab('shell')
            } else if (command === 'ssh') {
                if (this.isPay || this.sessionList.length < 5) {
                    this.sessionForm = {}
                    this.showAddSession = true
                    if (this.$refs.sessionForm) {
                        this.$refs.sessionForm.resetFields()
                    }
                } else {
                    this.licenseKey = ''
                    this.licenseVisible = true
                }
            }
        },
        async handleSaveSession() {
            this.$refs.sessionForm.validate(valid => {
                if (valid) {
                    let load = this.$loading({
                        lock: true,
                        text: 'Connect...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.3)'
                    })
                    const conn = new Client()
                    conn.on('ready', async () => {
                        load.close()
                        console.log('Client :: ready')
                        let sql =
                            'INSERT INTO session (label, tags, protocol, host, port, username, password, variable ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
                        let result = await window.ipcRenderer.invoke('db_insert', sql, [
                            '',
                            '',
                            'ssh',
                            this.sessionForm.host,
                            this.sessionForm.port,
                            this.sessionForm.username,
                            this.sessionForm.password,
                            '{}'
                        ])
                        this.querySessionAll()
                        this.showAddSession = false
                        this.addTab('ssh', this.sessionForm.host, conn)
                    })
                        .on('close', () => {
                            console.log('Conn :: close')
                        })
                        .on('error', error => {
                            this.$message.error(error)
                            load.close()
                        })
                        .connect({
                            host: this.sessionForm.host,
                            port: this.sessionForm.port,
                            username: this.sessionForm.username,
                            password: this.sessionForm.password
                        })
                }
            })
        },
        async handleUpdateSession() {
            this.$refs.sessionForm.validate(async valid => {
                if (valid) {
                    let sql =
                        'UPDATE session SET label = ?, host = ?, port = ?, username = ?, password = ? WHERE id = ?'
                    let result = await window.ipcRenderer.invoke('db_update', sql, [
                        this.sessionForm.label,
                        this.sessionForm.host,
                        this.sessionForm.port,
                        this.sessionForm.username,
                        this.sessionForm.password,
                        this.sessionForm.id
                    ])
                    this.$set(this.sessionList, this.index, JSON.parse(JSON.stringify(this.sessionForm)))
                    this.showEditSession = false
                }
            })
        },
        handleHosts() {
            this.classify = 'Hosts'
            this.$nextTick(() => {
                let tabsItems = document.querySelectorAll('.el-tabs__item')
                tabsItems.forEach(item => {
                    item.style.color = '#fff'
                })
            })
            if (os.platform() != 'darwin') {
                window.ipcRenderer.invoke('setTitleBarOverlay', this.mainBackground)
            }
        },
        handleSFTP() {
            this.classify = 'SFTP'
            this.$nextTick(() => {
                let tabsItems = document.querySelectorAll('.el-tabs__item')
                tabsItems.forEach(item => {
                    item.style.color = '#fff'
                })
            })
            if (os.platform() != 'darwin') {
                window.ipcRenderer.invoke('setTitleBarOverlay', this.mainBackground)
            }
        },
        showSnippetMenu(event, index) {
            this.index = index
            this.isSnippetMenuVisible = true
            this.menuTop = event.clientY
            this.menuLeft = event.clientX
        },
        menuSnippetAction(action) {
            this.isSnippetMenuVisible = false
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
                        if (item.parentNode.classList.contains('snippetLable')) {
                            item.style.color = this.theme.foreground
                        }
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
            if (item.protocol === 'shell') {
                if (this.platform != 'win32') {
                    window.ipcRenderer.invoke('write', this.activeName, '\x15')
                }
                window.ipcRenderer.invoke(
                    'write',
                    this.activeName,
                    this.platform === 'win32' ? script + '\r\n' : script + '\n'
                )
            } else if (item.protocol === 'ssh') {
                item.stream.write('\x15')
                item.stream.write(script + '\n')
            }
            item.xterm.focus()
        },
        handlePaste(script) {
            let item = this.tabs[this.activeName]
            if (item.protocol === 'shell') {
                if (this.platform != 'win32') {
                    window.ipcRenderer.invoke('write', this.activeName, '\x15')
                }
                window.ipcRenderer.invoke('write', this.activeName, script)
            } else if (item.protocol === 'ssh') {
                item.stream.write('\x15')
                item.stream.write(script)
            }
            item.xterm.focus()
        },
        handleNewSnippet() {
            if (this.isPay || this.snippetList.length < 5) {
                this.snippetForm = {
                    name: '',
                    script: ''
                }
                this.showAddSnippet = true
                this.$nextTick(() => {
                    let inputItems = document.querySelectorAll('.el-input__inner')
                    inputItems.forEach(item => {
                        if (item.parentNode.classList.contains('snippetLable')) {
                            item.style.color = this.theme.foreground
                        }
                    })
                    let textareaItems = document.querySelectorAll('.el-textarea__inner')
                    textareaItems.forEach(item => {
                        item.style.color = this.theme.foreground
                    })
                })
            } else {
                this.licenseKey = ''
                this.licenseVisible = true
            }
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
                    this.querySnippetAll()
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
                    let sql = 'UPDATE snippet SET name = ?, script = ?, targets = ? WHERE id = ?'
                    let result = await window.ipcRenderer.invoke('db_update', sql, [
                        this.snippetForm.name,
                        this.snippetForm.script,
                        '',
                        this.snippetForm.id
                    ])
                    this.$set(this.snippetList, this.index, JSON.parse(JSON.stringify(this.snippetForm)))
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
        async querySessionAll() {
            this.sessionList = await window.ipcRenderer.invoke(
                'db_all',
                'select * from session order  by upodate_time desc'
            )
        },
        addTab(protocol, label, conn) {
            this.classify = 'Sessions'
            let nodeId = Math.random().toString(36).slice(-6)
            let item = {
                protocol: protocol,
                label: protocol === 'shell' ? 'Local Shell' : label,
                name: nodeId,
                xterm: null,
                fitAddon: null,
                clipboardAddon: null,
                searchAddon: null,
                webLinksAddon: null,
                conn: conn
            }
            this.tabs[nodeId] = item
            this.activeName = nodeId
            this.$nextTick(() => {
                this.initTerminal(item, conn)
            })
            if (os.platform() != 'darwin') {
                window.ipcRenderer.invoke('setTitleBarOverlay', this.theme.background)
            }
        },
        handleSetting() {
            this.settingFlag = !this.settingFlag
            localStorage.setItem('settingFlag', this.settingFlag)
            for (const key in this.tabs) {
                this.$nextTick(() => {
                    let item = this.tabs[key]
                    item.fitAddon.fit()
                    if (item.protocol === 'shell') {
                        window.ipcRenderer.invoke('resize', key, item.xterm.rows, item.xterm.cols)
                    } else if (item.protocol === 'ssh') {
                        item.stream.setWindow(item.xterm.rows, item.xterm.cols)
                    }
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
            let activeName = ''
            for (let key in this.tabs) {
                if (key === targetName) {
                    if (activeName) {
                        break
                    } else {
                        continue
                    }
                }
                activeName = key
            }
            let tab = this.tabs[targetName]
            if (tab) {
                tab.fitAddon.dispose()
                tab.clipboardAddon.dispose()
                tab.searchAddon.dispose()
                tab.webLinksAddon.dispose()
                tab.xterm.dispose(this.$refs[tab.name])
                if (tab.protocol === 'shell') {
                    window.ipcRenderer.invoke('dispose', tab.name)
                } else if (tab.protocol === 'ssh') {
                    tab.stream.close()
                }
            }
            this.activeName = activeName
            this.$delete(this.tabs, targetName)
            if (Object.keys(this.tabs).length === 0) {
                this.classify = 'Hosts'
                if (os.platform() != 'darwin') {
                    window.ipcRenderer.invoke('setTitleBarOverlay', '#353951')
                }
            } else {
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
            }
        },
        tabClick(tab) {
            this.classify = 'Sessions'
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
            if (os.platform() != 'darwin') {
                window.ipcRenderer.invoke('setTitleBarOverlay', this.theme.background)
            }
        },
        initTerminal(item, conn) {
            item.xterm = new Terminal({
                cursorBlink: this.platform === 'win32' ? true : false,
                cursorStyle: this.platform === 'win32' ? 'underline' : 'block',
                fontFamily: 'Source Code Pro, monospace',
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
            item.xterm.onData(data => this.terminalOnData(item.protocol, item.name, data))
            item.xterm.onSelectionChange(() => {
                if (item.xterm.hasSelection()) {
                    navigator.clipboard.writeText(item.xterm.getSelection())
                }
            })
            //item.xterm.onKey(event => this.terminalOnKey(event))
            item.xterm.element.addEventListener('contextmenu', event => {
                event.preventDefault()
                navigator.clipboard.readText().then(text => {
                    if (item.protocol === 'shell') {
                        window.ipcRenderer.invoke('write', item.name, text)
                    } else if (item.protocol === 'ssh') {
                        item.stream.write(text)
                    }
                })
            })
            item.fitAddon.fit()
            if (item.protocol === 'shell') {
                window.ipcRenderer.invoke('terminal', item.name, item.xterm.rows, item.xterm.cols)
            } else if (item.protocol === 'ssh') {
                conn.shell({ cols: item.xterm.cols, rows: item.xterm.rows }, (err, stream) => {
                    if (err) throw err
                    item.stream = stream
                    stream
                        .on('close', () => {
                            console.log('Stream :: close')
                            conn.end()
                            this.removeTab(item.name)
                        })
                        .on('data', data => {
                            item.xterm.write(data)
                        })
                })
            }
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
        terminalOnData(protocol, name, data) {
            if (protocol === 'shell') {
                window.ipcRenderer.invoke('write', name, data)
            } else if (protocol === 'ssh') {
                let item = this.tabs[name]
                if (os.platform() === 'win32') {
                    if (data === '\x16') {
                        navigator.clipboard.readText().then(text => {
                            item.stream.write(text)
                        })
                    } else {
                        item.stream.write(data)
                    }
                } else {
                    item.stream.write(data)
                }
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
}

.profile {
    border-radius: 8px;
    width: 875px;
    height: 650px;
    color: #272727;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

::v-deep .el-dropdown-menu__item:hover {
    background-color: rgb(121, 123, 136, 0.1) !important;
    color: #272727 !important;
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
    padding: 2px 0;
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
    border: none;
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
    padding: 12px;
    cursor: pointer;
    width: 100px;
    font-size: 13px;
}
li:hover {
    border-radius: 8px;
    background-color: rgb(121, 123, 136, 0.1);
}
::v-deep .ag-cell-focus,
.ag-cell-no-focus {
    border: none !important;
}
::v-deep .no-border.ag-cell:focus {
    border: none !important;
    outline: none;
}
::v-deep .transfers .el-tabs__item.is-active {
    color: #272727 !important;
    background: #fff !important;
}
::v-deep .transfers .el-tabs__item:not(.is-disabled):hover {
    color: #272727 !important;
}
::v-deep .transfers .el-tabs__item {
    background-color: #e4e7ed !important;
    color: #909399 !important;
    border-radius: 0px !important;
    margin-left: 0px !important;
}
::v-deep .el-table th {
    height: 34px;
    font-size: 12px !important;
}
::v-deep .el-table td {
    font-size: 12px !important;
    font-weight: 450;
}
::v-deep .el-table thead th {
    background: #f5f7f7 !important;
}
::v-deep .el-table__body tr.selection-row > td {
    background: #0264e1 !important;
    color: #fff !important;
}
::v-deep .el-tabs--border-card > .el-tabs__content {
    padding: 0px;
}
::v-deep .autocomplete .el-input__inner {
    border-radius: 0px;
    border-left: 2px solid #dcdfe6;
    border-top: none;
    border-bottom: none;
    border-right: none;
}
::v-deep .el-input.is-disabled .el-input__inner {
    background-color: rgb(121, 123, 136, 0.1);
}
</style>
