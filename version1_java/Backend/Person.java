public class Person {

    private String name;
    private double share;


    public Person(String name) {

        this.name = name;
        this.share = 0;
    }


    public String getName() {

        return name;
    }


    public void setName(String name) {

        this.name = name;
    }


    public double getShare() {

        return share;
    }


    public void setShare(double share) {

        this.share = share;
    }
}