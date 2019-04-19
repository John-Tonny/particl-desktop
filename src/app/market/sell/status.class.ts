interface UiStatus {
    status: string;
    class: string;
    status_info: string;
    action_icon: string;
    action_button: string;
    action_tooltip: string;
    action_color: string;
    action_disabled: boolean;
}

export class Status {
    private states: Array<UiStatus> = [
        {
            status: 'unpublished',
            class: 'unpublished',
            status_info: 'Inactive, unpublished listing template – used to tweak your listing before publishing'
                + '(or after you take down your active listings later)',
            action_icon: 'part-check',
            action_button: '公布',
            action_tooltip: '向市场公布商品并销售',
            action_color: 'primary',
            action_disabled: false
        }, {
            status: 'awaiting',
            class: 'pending',
            status_info: 'Awaiting publication!',
            action_icon: 'part-check',
            action_button: '等待公布',
            action_tooltip: '等待向市场公布商品!',
            action_color: 'primary',
            action_disabled: true
        },
        {
            status: 'published',
            class: 'published',
            status_info: 'Active, published listing template',
            action_icon: 'part-check',
            action_button: '已公布',
            action_tooltip: '已在市场上公布!',
            action_color: 'primary',
            action_disabled: true
        }];
    get(status: string): UiStatus {
        return this.states.find((state: UiStatus) => state.status === status);
    }
}
