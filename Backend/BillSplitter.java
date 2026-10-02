public class BillSplitter {


    public double calculateTip(
        Bill bill
    ) {

        return
            bill.getTipAmount();
    }


    public double calculateTotal(
        Bill bill
    ) {

        double tip =
            calculateTip(bill);


        return
            bill.getAmount()
            + tip;
    }


    public double calculatePerPerson(
        Bill bill
    ) {

        double total =
            calculateTotal(bill);


        return
            total
            / bill.getNumberOfPeople();
    }


    public void calculatePersonShares(
        Bill bill
    ) {

        double share =
            calculatePerPerson(bill);


        for (
            Person person :
            bill.getPeople()
        ) {

            person.setShare(
                share
            );
        }
    }
}