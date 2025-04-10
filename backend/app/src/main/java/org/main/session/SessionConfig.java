package org.main.session;

import org.eclipse.jetty.server.session.DatabaseAdaptor;
import org.eclipse.jetty.server.session.DefaultSessionCache;
import org.eclipse.jetty.server.session.JDBCSessionDataStoreFactory;
import org.eclipse.jetty.server.session.SessionCache;
import org.eclipse.jetty.server.session.SessionHandler;
import org.main.DatabaseConfig;

import com.google.inject.Inject;

public class SessionConfig {
    final DatabaseConfig databaseConfig;

    @Inject
    public SessionConfig(DatabaseConfig databaseConfig) {
        this.databaseConfig = databaseConfig;
    }

    public SessionHandler sqlSessionHandler() {
        SessionHandler sessionHandler = new SessionHandler();
        SessionCache sessionCache = new DefaultSessionCache(sessionHandler);
        sessionCache.setSessionDataStore(
                jdbcDataStoreFactory().getSessionDataStore(sessionHandler));
        sessionHandler.setSessionCache(sessionCache);
        sessionHandler.setHttpOnly(true);
        // make additional changes to your SessionHandler here
        return sessionHandler;
    }

    private JDBCSessionDataStoreFactory jdbcDataStoreFactory() {
        DatabaseAdaptor databaseAdaptor = new DatabaseAdaptor();
        // databaseAdaptor.setDriverInfo(driver, url);
        databaseAdaptor.setDatasource(this.databaseConfig.getDataSource());
        // databaseAdaptor.setDatasource(myDataSource); // you can set data source here
        // (for connection pooling, etc)
        JDBCSessionDataStoreFactory jdbcSessionDataStoreFactory = new JDBCSessionDataStoreFactory();
        jdbcSessionDataStoreFactory.setDatabaseAdaptor(databaseAdaptor);
        return jdbcSessionDataStoreFactory;
    }
}
