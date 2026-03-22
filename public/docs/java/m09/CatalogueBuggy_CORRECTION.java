import java.util.ArrayList;

/**
 * CODEQUEST M09 — Debugging — CORRECTION
 * 5 bugs corriges avec explications.
 */
public class CatalogueBuggy_CORRECTION {

    private ArrayList<String> inventions;
    private int compteur;

    public CatalogueBuggy_CORRECTION() {
        // CORRECTION BUG 1 : initialiser la ArrayList !
        // Sans cela : NullPointerException sur inventions.add()
        inventions = new ArrayList<>();
        compteur = 0;
    }

    public void ajouter(String nom) {
        inventions.add(nom);
        compteur++;
        System.out.println("Ajoute : " + nom + " (total: " + compteur + ")");
    }

    public void afficherTout() {
        System.out.println("=== Catalogue ===");
        // CORRECTION BUG 2 : < au lieu de <=
        // <= cause ArrayIndexOutOfBoundsException car index va de 0 a size()-1
        for (int i = 0; i < inventions.size(); i++) {
            System.out.println((i + 1) + ". " + inventions.get(i));
        }
    }

    public double calculerMoyenneAnnees(int[] annees) {
        int somme = 0;
        // CORRECTION BUG 3 : commencer a 0, pas 1
        // Sinon on perd le premier element du tableau
        for (int i = 0; i < annees.length; i++) {
            somme += annees[i];
        }
        // CORRECTION BUG 4 : cast en double AVANT la division
        // int / int = int en Java (perd les decimales)
        return (double) somme / annees.length;
    }

    public boolean contient(String nom) {
        for (String inv : inventions) {
            // CORRECTION BUG 5 : .equals() au lieu de ==
            // == compare les REFERENCES (adresses memoire)
            // .equals() compare le CONTENU des Strings
            if (inv.equals(nom)) {
                return true;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        CatalogueBuggy_CORRECTION cat = new CatalogueBuggy_CORRECTION();

        cat.ajouter("Telephone");
        cat.ajouter("Ampoule");
        cat.ajouter("Internet");

        cat.afficherTout();

        int[] annees = {1876, 1879, 1969, 1995, 2007};
        System.out.println("Moyenne : " + cat.calculerMoyenneAnnees(annees));
        // Correct : 1945.2

        String test = new String("Telephone");
        System.out.println("Contient Telephone : " + cat.contient(test));
        // Correct : true
    }
}
