import { Component, ComponentClass, Ref, ComponentType } from 'react';

declare module esoftplay {

  export class esp {
    static asset(path: string): any;
    static config(param?: string, ...params: string[]): any;
    static _config(): string | number | boolean;
    static mod(path: string): any;
    static reducer(): any;
    static navigations(): any;
    static home(): any;
    static log(message?: any, ...optionalParams: any[]): void;
    static routes(): any;
    static getTokenAsync(callback: (token: string) => void): void;
    static notif(): any;
  }

  export interface ContentAudioProps {
    onRef: (ref: any) => void,
    code: string,
    onStatusChange: (status: any) => void
  }

  export interface ContentAudioState {
    playbackInstanceName: string,
    muted: boolean,
    playbackInstancePosition: any,
    playbackInstanceDuration: any,
    shouldPlay: boolean,
    isPlaying: boolean,
    isBuffering: boolean,
    isLoading: boolean,
    volume: number,
  }

  export class ContentAudio extends Component<ContentAudioProps, ContentAudioState> { }

  export interface ContentCommentProps {
    navigation: any,
    url?: string,
    id: string,
    url_post?: string,
    user?: any
  }

  export interface ContentCommentState {
    user: any,
    url: any,
    url_post: any
  }

  export class ContentComment extends Component<ContentCommentProps, ContentCommentState> { }

  export interface ContentDetailProps {
    url?: string,
    navigation: any
  }

  export interface ContentDetailState {
    scrollY: any,
    toolbarHeight: number,
    result: any,
    images_page: number,
    isPlayingAudio: boolean,
    showModal: boolean,
    view: any,
    isPageReady: boolean,
  }

  export class ContentDetail extends Component<ContentDetailProps, ContentDetailState> { }

  export class ContentIndex extends Component<null, null> { }

  export interface ContentItemProps {
    index: number,
    navigation: any,
    id?: number | string,
    url?: string | '',
    title?: string,
    created?: string,
    image?: string,
    intro?: string,
    description?: string,
    updated?: string,
    publish?: string,
  }

  export interface ContentItemState { }

  export class ContentItem extends Component<ContentItemProps, ContentItemState> { }


  export interface ContentListProps {
    url?: string,
    title?: string,
    dispatch?: any,
    navigation: any
  }
  export interface ContentListState {
    animSearch: any,
    url: string,
    urlori: string,
    title: string,
    titleori: string,
    data: any[],
    page: number,
    isDrawerOpen: boolean,
    searchView: boolean,
    isRefreshing: boolean,
    isStop: boolean,
  }


  export class ContentList extends Component<ContentListProps, ContentListState>{ }

  export interface ContentMenuProps {
    url: string,
    closeDrawer: () => void,
    onItemSelected: (item: any) => void,
    style?: any
  }

  export interface ContentMenuState {
    menu: any[],
    selectedId: number
  }
  export class ContentMenu extends Component<ContentMenuProps, ContentMenuState> { }

  export interface ContentSearchProps {
    defaultValue?: any,
    close: () => void,
    onSubmit: (uri: string) => void,
  }

  export interface ContentSearchState {

  }

  export class ContentSearch extends Component<ContentSearchProps, ContentSearchState> { }

  export interface ContentVideoProps {
    code: string,
    style?: any
  }

  export interface ContentVideoState {

  }
  export class ContentVideo extends Component<ContentVideoProps, ContentVideoState> { }

  export class LibCrypt {
    constructor();
    encode(text: string): string;
    decode(text: string): string;
  }

  export class LibCurl {
    constructor(uri?: string, post?: any, onDone?: (res: any, msg: string) => void, onFailed?: (msg: string) => void, debug?: number);
    setUrl(url: string): void;
    setUri(uri: string): void;
    setHeader(): void;
    onDone(result: any, msg?: string): void;
    onFailed(msg: string): void;
    onError(msg: string): void;
    upload(uri: string, postKey: string, fileUri: string, mimeType: string, onDone?: (res: any, msg: string) => void, onFailed?: (msg: string) => void, debug?: number): Promise<any>;
    custom(uri: string, post: any, onDone?: (res: any) => void, debug?: number): Promise<any>;
  }

  export interface LibListProps {
    staticWidth?: number,
    staticHeight?: number,
    data: any[],
    renderItem: (data: any, index: number) => {},
  }

  export interface LibListState {
    data: any[]
  }

  export class LibList extends Component<LibListProps, LibListState> { }

  export interface LibMenuProps {
    onItemSelected: (item: any) => void,
    parent?: number,
    style?: any,
    data: any,
    selectedId: number
  }

  export interface LibMenuState {

  }

  export class LibMenu extends Component<LibMenuProps, LibMenuState> { }

  export interface LibMenusubProps {
    data: any,
    id: number,
    selectedId: number,
    title: string,
    onClick: (data: any) => {}
  }

  export interface LibMenusubState {
    expanded: boolean
  }

  export class LibMenusub extends Component<LibMenusubProps, LibMenusubState> { }

  export class LibNotification {
    static listen(callback?: (obj: any) => void): Promise<any>;
    static get(action?: (res: any) => void): Promise<any>;
    static requestPermission(callback?: (token: any) => void): Promise<any>;
  }
  export interface LibPickerProps {
    max: number | 0,
    color?: string,
    show: boolean,
    dismiss: () => {}
  }
  export interface LibPickerState {
    photos: any[],
    selected: any,
    after: any,
    has_next_page: boolean
  }

  export class LibPicker extends Component<LibPickerProps, LibPickerState> { }

  export interface LibScrollProps {
    numColumns?: number,
    defaultHeight?: number,
    children: any,
  }

  export interface LibScrollState {
    width: number,
    data: any
  }

  export class LibScroll extends Component<LibScrollProps, LibScrollState> { }

  export interface LibSocialloginProps {
    url?: string,
    onResult: (userData: any) => void
  }
  export interface LibSocialloginState {

  }

  export class LibSocialLogin extends Component<LibSocialloginProps, LibSocialloginState> {
    static getUser(callback?: (userData: any) => void): Promise<any>;
  }

  export class LibSqlite {
    init(dbname?: string, createStatement?: string, version?: string, description?: string, size?: any | null): void
    create(createStatement: string, debug: number): Promise<any>;
    drop(dbname: string, debug: number): Promise<any>;
    getColumn(): any[]
    execute(sqlStatement: string, callback?: (e: any) => void, debug?: number): Promise<any>
    getSQLFormat(): string;
    verify(values: any, debug: number): any;
    Insert(values: any, callback?: (insertId: number) => void, debug?: number): Promise<any>
    Update(id: string | number, values: any, callback?: (rowsAffected: number) => void, debug?: number): Promise<any>
    Delete(id?: string | number, fields?: string[], params?: any[], callback?: (rowsAffected: number) => void, debug?: number): Promise<any>
    getRow(id?: string | number, fields?: string[], params?: any[], callback?: (row: any) => void, debug?: number): Promise<any>
    getAll(fields?: string[], params?: any[], orderBy?: string, limit?: number, offset?: number, groupBy?: string, callback?: (data: any) => void, debug?: number): Promise<any>
  }

  export interface LibTextstyleProps {
    textStyle: 'largeTitle' | 'title1' | 'title2' | 'title3' | 'headline' | 'body' | 'callout' | 'subhead' | 'footnote' | 'caption1' | 'caption2',
    style?: any,
    children: string | '',
    text: string | ''
  }

  export interface LibTextstyleState {

  }

  export class LibTextstyle extends Component<LibTextstyleProps, LibTextstyleState>{ }

  export class LibUtils {
    static getArgs(props: any, key: string, defOutput?: any): any
    static getKeyBackOf(routeName: string, store: any): string
    static navReplace(store: any, navigation: any, routeName: string, params?: any): void
    static money(value: string | number, currency?: string, part?: number): string
    static number(toNumber: string | number): string
    static countDays(start: string | Date, end: string | Date): number
    static getDateTimeSeconds(start: string | Date, end: string | Date): number
    static ucwords(str: string): string;
    static getCurrentDateTime(format?: string): string
    static getDateAsFormat(input: any, format?: string): string
    static telTo(number: string | number): void
    static smsTo(number: string | number, message: string): void
    static waTo(number: string, message: string): void
    static mapTo(title: string, latlong: string): void
    static copyToClipboard(string: string): Promise<any>
    static colorAdjust(hex: string, lum: number): string
    static escapeRegExp(str: string): string
    static download(url: string, onDownloaded: (file: string) => void): void
    static share(message: string): void
  }

  export interface LibWebviewSourceProps {
    uri?: string,
    html?: string
  }

  export interface LibWebviewProps {
    defaultHeight?: number,
    source: LibWebviewSourceProps,
    needAnimate: boolean,
    AnimationDuration: number,
    needAutoResetHeight: boolean,
    onMessage?: any,
    bounces?: any,
    onLoadEnd?: any,
    style?: any,
    scrollEnabled?: any,
    automaticallyAdjustContentInsets?: any,
    scalesPageToFit?: any,
    onFinishLoad: () => void
  }

  export interface LibWebviewState {
    height: number,
    source: any
  }

  export class LibWebview extends Component<LibWebviewProps, LibWebviewState> { }


  export class UserClass {
    static create(user: any): Promise<any>
    static load(callback?: (user?: any) => void): Promise<any>
    static isLogin(callback: (user?: any) => void): Promise<any>
    static delete(): Promise<any>
  }

  export class UserIndex extends Component<{}>{
    static pushToken(): Promise<any>;
  }

  export interface UserLoginProps {

  }

  export interface UserLoginState {
    sosmed: string,
    username: string,
    password: string,
    email: string,
    isLoading: boolean
  }

  export class UserLogin extends Component<UserLoginProps, UserLoginState> { }

  export interface UserNotifbadgeProps {
    data: any[],
    onPress: () => void
  }

  export interface UserNotifbadgeState {

  }


  export class UserNotifbadge extends Component<UserNotifbadgeProps, UserNotifbadgeState> { }
}
