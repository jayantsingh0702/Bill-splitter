import java.util.ArrayList;

public class Bill {

    private double amount;

    private int numberOfPeople;

    private double tipAmount;

    private ArrayList<Person> people;


    public Bill(
        double amount,
        int numberOfPeople,
        double tipAmount
    ) {

        this.amount =
            amount;

        this.numberOfPeople =
            numberOfPeople;

        this.tipAmount =
            tipAmount;

        people =
            new ArrayList<>();
    }


    public double getAmount() {

        return amount;
    }


    public int getNumberOfPeople() {

        return numberOfPeople;
    }


    public double getTipAmount() {

        return tipAmount;
    }


    public ArrayList<Person> getPeople() {

        return people;
    }


    public void addPerson(
        Person person
    ) {

        people.add(person);
    }
}