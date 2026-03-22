import java.util.ArrayList;

/**
 * CODEQUEST M09 — Debugging
 * CE FICHIER CONTIENT 5 BUGS !
 * 
 * Utilisez le debugger Eclipse pour les trouver :
 * 1. Posez des breakpoints
 * 2. Lancez en mode Debug (icone insecte)
 * 3. Step Over (F6) et Watch List
 * 4. Pour chaque bug : notez la ligne, le type, la correction
 * 
 * Types de bugs : compilation, runtime, logique
 */
public class CatalogueBuggy {

    private ArrayList<String> inventions;
    private int compteur;

    public CatalogueBuggy() {
        // BUG 1 : inventions n'est jamais initialise
        // (NullPointerException quand on appelle add)
        compteur = 0;
    }

    public void ajouter(String nom) {
        inventions.add(nom);
        compteur++;
        System.out.println("Ajoute : " + nom + " (total: " + compteur + ")");
    }

    public void afficherTout() {
        System.out.println("=== Catalogue ===");
        // BUG 2 : <= au lieu de < (ArrayIndexOutOfBoundsException)
        for (int i = 0; i <= inventions.size(); i++) {
            System.out.println((i + 1) + ". " + inventions.get(i));
        }
    }

    public double calculerMoyenneAnnees(int[] annees) {
        int somme = 0;
        // BUG 3 : boucle commence a 1, perd le premier element
        for (int i = 1; i < annees.length; i++) {
            somme += annees[i];
        }
        // BUG 4 : division entiere (int/int) perd les decimales
        return somme / annees.length;
    }

    public boolean contient(String nom) {
        for (String inv : inventions) {
            // BUG 5 : == au lieu de .equals() pour comparer des Strings
            if (inv == nom) {
                return true;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        CatalogueBuggy cat = new CatalogueBuggy();

        // Test ajouter (declenchera BUG 1)
        cat.ajouter("Telephone");
        cat.ajouter("Ampoule");
        cat.ajouter("Internet");

        // Test afficher (declenchera BUG 2)
        cat.afficherTout();

        // Test moyenne (BUG 3 + BUG 4)
        int[] annees = {1876, 1879, 1969, 1995, 2007};
        System.out.println("Moyenne : " + cat.calculerMoyenneAnnees(annees));
        // Attendu : 1945.2, obtenu : quelque chose de faux

        // Test contient (BUG 5)
        String test = new String("Telephone");
        System.out.println("Contient Telephone : " + cat.contient(test));
        // Attendu : true, obtenu : false
    }
}
