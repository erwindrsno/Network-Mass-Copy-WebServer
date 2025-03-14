package org.example;

import java.sql.Connection;

import io.javalin.http.Context;

public class ComputerController {

    public static void insertComputer(Context ctx) {
        try (Connection conn = DatabaseConfig.getConnection()) {
            System.out.println("Connection ? " + conn.isValid(0));
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
