public class TestBill {

    public static void main(String[] args) {


        // Create bill
        // Bill Amount = ₹2000
        // Number of People = 4
        // Tip = ₹100

        Bill bill =
            new Bill(
                2000,
                4,
                100
            );


        // Create people

        bill.addPerson(
            new Person("Amit")
        );

        bill.addPerson(
            new Person("Aryan")
        );

        bill.addPerson(
            new Person("Rahul")
        );

        bill.addPerson(
            new Person("Rohit")
        );


        // Create calculator

        BillSplitter splitter =
            new BillSplitter();


        // Calculate person shares

        splitter.calculatePersonShares(
            bill
        );


        // Display results

        System.out.println(
            "Bill Amount: ₹"
            + bill.getAmount()
        );


        System.out.println(
            "Tip Amount: ₹"
            + splitter.calculateTip(bill)
        );


        System.out.println(
            "Total Bill: ₹"
            + splitter.calculateTotal(bill)
        );


        System.out.println(
            "Each Person Pays: ₹"
            + splitter.calculatePerPerson(bill)
        );


        System.out.println(
            "People:"
        );


        for (
            Person person :
            bill.getPeople()
        ) {

            System.out.println(
                "- " +
                person.getName() +
                " : ₹" +
                person.getShare()
            );

        }

    }

}