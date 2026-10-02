import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;


public class BillSplitterServer {


    public static void main(
        String[] args
    ) throws IOException {


        HttpServer server =
            HttpServer.create(
                new InetSocketAddress(8080),
                0
            );


        server.createContext(
            "/calculate",
            BillSplitterServer::calculateBill
        );


        server.setExecutor(null);


        server.start();


        System.out.println();
        System.out.println(
            "================================="
        );

        System.out.println(
            "      SMART BILL SPLITTER"
        );

        System.out.println(
            "================================="
        );

        System.out.println(
            "Java server started successfully!"
        );

        System.out.println();

        System.out.println(
            "Backend URL:"
        );

        System.out.println(
            "http://localhost:8080"
        );

        System.out.println();

        System.out.println(
            "Waiting for frontend requests..."
        );

        System.out.println(
            "================================="
        );
    }


    private static void calculateBill(
        HttpExchange exchange
    ) throws IOException {


        exchange.getResponseHeaders()
            .add(
                "Access-Control-Allow-Origin",
                "*"
            );


        exchange.getResponseHeaders()
            .add(
                "Access-Control-Allow-Headers",
                "Content-Type"
            );


        exchange.getResponseHeaders()
            .add(
                "Access-Control-Allow-Methods",
                "POST, OPTIONS"
            );


        // OPTIONS request

        if (
            "OPTIONS".equalsIgnoreCase(
                exchange.getRequestMethod()
            )
        ) {

            exchange.sendResponseHeaders(
                204,
                -1
            );

            exchange.close();

            return;
        }


        // Only POST allowed

        if (
            !"POST".equalsIgnoreCase(
                exchange.getRequestMethod()
            )
        ) {

            sendResponse(
                exchange,
                405,
                "{\"error\":\"POST request required\"}"
            );

            return;
        }


        // Read request

        String requestBody =
            new String(
                exchange
                    .getRequestBody()
                    .readAllBytes(),
                StandardCharsets.UTF_8
            );


        System.out.println();
        System.out.println(
            "Request received:"
        );

        System.out.println(
            requestBody
        );


        // ====================================
        // READ BILL INFORMATION
        // ====================================

        double amount =
            getNumber(
                requestBody,
                "amount"
            );


        int people =
            (int) getNumber(
                requestBody,
                "people"
            );


        // Tip is now a direct amount.
        // Example: 100 means ₹100 tip.

        double tip =
            getNumber(
                requestBody,
                "tip"
            );


        // ====================================
        // CREATE BILL OBJECT
        // ====================================

        Bill bill =
            new Bill(
                amount,
                people,
                tip
            );


        // ====================================
        // GET NAMES
        // ====================================

        String[] names =
            getNames(
                requestBody
            );


        // Create Person objects

        for (
            String name :
            names
        ) {

            if (
                !name.trim().isEmpty()
            ) {

                bill.addPerson(
                    new Person(
                        name.trim()
                    )
                );
            }
        }


        // If no names were supplied,
        // create simple person objects.

        if (
            bill.getPeople().isEmpty()
        ) {

            for (
                int i = 1;
                i <= people;
                i++
            ) {

                bill.addPerson(
                    new Person(
                        "Person " + i
                    )
                );
            }
        }


        // ====================================
        // CALCULATE
        // ====================================

        BillSplitter splitter =
            new BillSplitter();


        double tipAmount =
            splitter.calculateTip(
                bill
            );


        double total =
            splitter.calculateTotal(
                bill
            );


        double perPerson =
            splitter.calculatePerPerson(
                bill
            );


        // ====================================
        // CALCULATE INDIVIDUAL SHARES
        // ====================================

        splitter.calculatePersonShares(
            bill
        );


        // ====================================
        // CREATE JSON RESPONSE
        // ====================================

        StringBuilder response =
            new StringBuilder();


        response.append("{");


        response.append(
            "\"amount\":"
        );


        response.append(
            amount
        );


        response.append(
            ",\"people\":"
        );


        response.append(
            people
        );


        response.append(
            ",\"tipAmount\":"
        );


        response.append(
            tipAmount
        );


        response.append(
            ",\"total\":"
        );


        response.append(
            total
        );


        response.append(
            ",\"perPerson\":"
        );


        response.append(
            perPerson
        );


        // ====================================
        // PEOPLE ARRAY
        // ====================================

        response.append(
            ",\"peopleList\":["
        );


        for (
            int i = 0;
            i < bill.getPeople().size();
            i++
        ) {

            Person person =
                bill.getPeople().get(i);


            response.append("{");


            response.append(
                "\"name\":\""
            );


            response.append(
                escapeJson(
                    person.getName()
                )
            );


            response.append(
                "\",\"share\":"
            );


            response.append(
                person.getShare()
            );


            response.append("}");


            if (
                i <
                bill.getPeople().size() - 1
            ) {

                response.append(",");
            }
        }


        response.append(
            "]"
        );


        response.append("}");


        System.out.println(
            "Response sent:"
        );


        System.out.println(
            response
        );


        sendResponse(
            exchange,
            200,
            response.toString()
        );
    }


    // ====================================
    // GET NUMBER FROM JSON
    // ====================================

    private static double getNumber(
        String json,
        String key
    ) {


        String search =
            "\"" + key + "\"";


        int keyPosition =
            json.indexOf(
                search
            );


        if (
            keyPosition == -1
        ) {

            return 0;
        }


        int colonPosition =
            json.indexOf(
                ":",
                keyPosition
            );


        if (
            colonPosition == -1
        ) {

            return 0;
        }


        int endPosition =
            json.indexOf(
                ",",
                colonPosition
            );


        if (
            endPosition == -1
        ) {

            endPosition =
                json.indexOf(
                    "}",
                    colonPosition
                );
        }


        String value =
            json.substring(
                colonPosition + 1,
                endPosition
            ).trim();


        return Double.parseDouble(
            value
        );
    }


    // ====================================
    // GET NAMES ARRAY
    // ====================================

    private static String[] getNames(
        String json
    ) {


        String key =
            "\"names\"";


        int keyPosition =
            json.indexOf(key);


        if (
            keyPosition == -1
        ) {

            return new String[0];
        }


        int start =
            json.indexOf(
                "[",
                keyPosition
            );


        int end =
            json.indexOf(
                "]",
                start
            );


        if (
            start == -1 ||
            end == -1
        ) {

            return new String[0];
        }


        String namesText =
            json.substring(
                start + 1,
                end
            );


        if (
            namesText.trim().isEmpty()
        ) {

            return new String[0];
        }


        String[] rawNames =
            namesText.split(
                ","
            );


        String[] names =
            new String[
                rawNames.length
            ];


        for (
            int i = 0;
            i < rawNames.length;
            i++
        ) {

            String name =
                rawNames[i].trim();


            name =
                name.replace(
                    "\"",
                    ""
                );


            names[i] =
                name;
        }


        return names;
    }


    // ====================================
    // ESCAPE JSON
    // ====================================

    private static String escapeJson(
        String text
    ) {

        return text
            .replace(
                "\\",
                "\\\\"
            )
            .replace(
                "\"",
                "\\\""
            );
    }


    // ====================================
    // SEND RESPONSE
    // ====================================

    private static void sendResponse(
        HttpExchange exchange,
        int statusCode,
        String response
    ) throws IOException {


        byte[] responseBytes =
            response.getBytes(
                StandardCharsets.UTF_8
            );


        exchange.getResponseHeaders()
            .set(
                "Content-Type",
                "application/json"
            );


        exchange.sendResponseHeaders(
            statusCode,
            responseBytes.length
        );


        OutputStream output =
            exchange.getResponseBody();


        output.write(
            responseBytes
        );


        output.close();
    }
}