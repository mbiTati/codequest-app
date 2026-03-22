import java.util.ArrayList;
import java.util.Scanner;

/**
 * CODEQUEST M07 — Securite
 * CE FICHIER A DES FAILLES DE SECURITE !
 * 
 * CONSIGNES :
 * 1. Identifier les 6 failles de securite
 * 2. Corriger chacune avec try-catch, validation, null checks
 * 3. Le programme ne doit JAMAIS planter, quoi que l'utilisateur tape
 */
public class CatalogueInsecure {

    private ArrayList<String> inventions;

    public CatalogueInsecure() {
        inventions = new ArrayList<>();
    }

    // FAILLE 1 : pas de validation sur nom (null, vide, trop long)
    public void ajouter(String nom) {
        inventions.add(nom);
        System.out.println("Ajoute : " + nom);
    }

    // FAILLE 2 : pas de verification d'index
    public String getParIndex(int index) {
        return inventions.get(index);
    }

    // FAILLE 3 : pas de try-catch sur parseInt
    public void ajouterAvecAnnee(String nom, String anneeStr) {
        int annee = Integer.parseInt(anneeStr);
        inventions.add(nom + " (" + annee + ")");
    }

    // FAILLE 4 : NullPointerException possible
    public boolean contient(String nom) {
        return nom.toLowerCase().equals(inventions.get(0).toLowerCase());
    }

    // FAILLE 5 : boucle sans protection sur liste vide
    public double moyenneCaracteres() {
        int total = 0;
        for (String inv : inventions) {
            total += inv.length();
        }
        return total / inventions.size(); // division par zero si liste vide !
    }

    // FAILLE 6 : mot de passe en dur
    public boolean authentifier(String motDePasse) {
        String MDP_ADMIN = "admin123";
        return motDePasse.equals(MDP_ADMIN);
    }

    public static void main(String[] args) {
        CatalogueInsecure cat = new CatalogueInsecure();
        Scanner sc = new Scanner(System.in);

        // Ces appels vont PLANTER ou avoir un comportement dangereux :
        cat.ajouter(null);                         // FAILLE 1
        cat.getParIndex(99);                       // FAILLE 2
        cat.ajouterAvecAnnee("Test", "pas un nb"); // FAILLE 3
        cat.contient(null);                        // FAILLE 4
        System.out.println(cat.moyenneCaracteres()); // FAILLE 5
        cat.authentifier("admin123");              // FAILLE 6
    }
}
