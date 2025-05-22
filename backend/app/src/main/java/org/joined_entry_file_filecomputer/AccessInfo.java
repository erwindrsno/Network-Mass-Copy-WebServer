package org.joined_entry_file_filecomputer;

import java.util.List;

import org.websocket.DirectoryAccessInfo;
import org.websocket.FileAccessInfo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccessInfo {
  List<FileAccessInfo> listFai;
  List<DirectoryAccessInfo> listDai;
}

// alasan listDai terpisah dengan listFai, untuk menghindari coupling.
// setiap fai sudah ada direktori id nya.
