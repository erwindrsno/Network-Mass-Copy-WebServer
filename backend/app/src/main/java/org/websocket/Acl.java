package org.websocket;

import java.nio.file.attribute.AclEntryPermission;
import java.util.Arrays;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

public class Acl {
  static public Set<AclEntryPermission> getReadAcl() {
    return readPermissions;
  }

  static public Set<AclEntryPermission> getWriteAcl() {
    return writePermissions;
  }

  static public Set<AclEntryPermission> getExecuteAcl() {
    return executePermissions;
  }

  static public Set<AclEntryPermission> getRWXAcl() {
    return rwxPermissions;
  }

  static public String serializeAclEntryPermissionSet(Set<AclEntryPermission> aclEntries) {
    return aclEntries.stream()
        .map(AclEntryPermission::name)
        .collect(Collectors.joining(","));
  }

  static public Set<AclEntryPermission> deserializeAclEntryPermissionSet(String serializedAcl) {
    if (serializedAcl == null || serializedAcl.isEmpty()) {
      return Collections.emptySet();
    }
    return Arrays.stream(serializedAcl.split(","))
        .map(AclEntryPermission::valueOf)
        .collect(Collectors.toSet());
  }

  static private Set<AclEntryPermission> rwxPermissions = Set.of(
      AclEntryPermission.READ_DATA,
      AclEntryPermission.READ_ACL,
      AclEntryPermission.READ_ATTRIBUTES,
      AclEntryPermission.READ_NAMED_ATTRS,
      AclEntryPermission.WRITE_DATA,
      AclEntryPermission.APPEND_DATA,
      AclEntryPermission.WRITE_ATTRIBUTES,
      AclEntryPermission.WRITE_NAMED_ATTRS,
      AclEntryPermission.DELETE,
      AclEntryPermission.DELETE_CHILD,
      AclEntryPermission.EXECUTE);

  static private Set<AclEntryPermission> readPermissions = Set.of(
      AclEntryPermission.READ_DATA,
      AclEntryPermission.READ_ACL,
      AclEntryPermission.READ_ATTRIBUTES,
      AclEntryPermission.READ_NAMED_ATTRS);

  static private Set<AclEntryPermission> writePermissions = Set.of(
      AclEntryPermission.WRITE_DATA,
      AclEntryPermission.APPEND_DATA,
      AclEntryPermission.WRITE_ATTRIBUTES,
      AclEntryPermission.WRITE_NAMED_ATTRS,
      AclEntryPermission.DELETE,
      AclEntryPermission.DELETE_CHILD);

  static private Set<AclEntryPermission> executePermissions = Set.of(
      AclEntryPermission.EXECUTE);
}
