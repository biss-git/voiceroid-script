export interface FileInfo {
  name: string;
  extension: string;
  content: any;
}

export interface GoogleFileInfo extends FileInfo {
  id: string;
  permissions: PermissionInfo[];
}

export interface PermissionInfo {
  id: string;
  type: string;
  role: string;
  targetId: string;
}

export interface UserInfo {
  displayName: string;
  emailAddress: string;
  photoLink: string;
  kind: string;
  me: boolean;
  permissionId: string;
}
