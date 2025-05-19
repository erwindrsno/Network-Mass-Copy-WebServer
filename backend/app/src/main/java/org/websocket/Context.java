package org.websocket;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonDeserialize(builder = Context.ContextBuilder.class)
public class Context {
  @JsonProperty("entry_id")
  Integer entryId;

  @JsonProperty("list_fai")
  List<FileAccessInfo> listFai;

  @JsonProperty("list_dai")
  List<DirectoryAccessInfo> listDai;

  @JsonProperty("list_fcm")
  List<FileChunkMetadata> listFcm;
}
