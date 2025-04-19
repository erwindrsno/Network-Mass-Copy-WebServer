package org.entry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.google.inject.Singleton;

import io.javalin.http.Context;

@Singleton
public class EntryController {
  private Logger logger = LoggerFactory.getLogger(EntryController.class);
  private final EntryService entryService;

  @Inject
  public EntryController(EntryService entryService) {
    this.entryService = entryService;
  }

  public void insertEntry(Context ctx) {
    String title = ctx.formParam("title");
    logger.info("Title is: " + title);
    // String completeness = null;
    // Entry entry = new Entry(null, title, completeness, 1);
    // this.entryService.createEntry(entry);
  }

  public void getAllEntries(Context ctx) {
    ctx.json(this.entryService.getAllEntries());
  }
}
