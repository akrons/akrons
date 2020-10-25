export namespace GraphInterfaces {
    export interface IUserInfo {
        '@odata.context': string;
        businessPhones: string[];
        displayName: string;
        givenName: string;
        jobTitle: string;
        mail: string;
        mobilePhone: string;
        officeLocation: any | null;
        preferredLanguage: string;
        surname: string;
        userPrincipalName: string;
        id: string;
    }

    export interface IMemberResult {
        '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#directoryObjects';
        value: IBaseGroup[];
    }

    export interface IBaseGroup {
        '@odata.type': string;
        id: string;
        deletedDateTime: any | null;
        description: string;
        displayName: string;
    }

    export interface IDirectoryRole extends IBaseGroup {
        roleTemplateId: string;
    }

    export interface IGroup extends IBaseGroup {
        '@odata.type': string;
        classification: any | null;
        createdDateTime: string;
        creationOptions: any[];
        groupTypes: any[];
        isAssignableToRole: any | null;
        mail: any | null;
        mailEnabled: boolean;
        mailNickname: string;
        onPremisesDomainName: any | null;
        onPremisesLastSyncDateTime: any | null;
        onPremisesNetBiosName: any | null;
        onPremisesSamAccountName: any | null;
        onPremisesSecurityIdentifier: any | null;
        onPremisesSyncEnabled: any | null;
        preferredDataLocation: any | null;
        proxyAddresses: any[];
        renewedDateTime: string;
        resourceBehaviorOptions: any[];
        resourceProvisioningOptions: any[];
        securityEnabled: boolean;
        securityIdentifier: string;
        visibility: any | null;
        onPremisesProvisioningErrors: any[];
    }
}
