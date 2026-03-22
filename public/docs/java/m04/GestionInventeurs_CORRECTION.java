import java.util.ArrayList;
import java.util.Scanner;

/**
 * CODEQUEST - Module 04
 * ⚠️ CORRECTION — NE PAS DISTRIBUER AUX ÉTUDIANTS
 */
public class GestionInventeurs_CORRECTION {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ArrayList<String> noms = new ArrayList<>();
        ArrayList<String> specialites = new ArrayList<>();
        int choix;
        
        do {
            System.out.println("\n=== GESTION DES INVENTEURS ===");
            System.out.println("1. Ajouter  2. Afficher  3. Rechercher");
            System.out.println("4. Modifier 5. Supprimer 6. Stats  0. Quitter");
            System.out.print("Choix : ");
            choix = sc.nextInt(); sc.nextLine();
            
            switch (choix) {
                case 1:
                    System.out.print("Nom : ");
                    String nom = sc.nextLine();
                    System.out.print("Spécialité : ");
                    String spec = sc.nextLine();
                    noms.add(nom);
                    specialites.add(spec);
                    System.out.println("✓ Ajouté : " + nom);
                    break;
                case 2:
                    if (noms.isEmpty()) {
                        System.out.println("Aucun inventeur.");
                    } else {
                        for (int i = 0; i < noms.size(); i++) {
                            System.out.println((i+1) + ". " + noms.get(i) + " (" + specialites.get(i) + ")");
                        }
                    }
                    break;
                case 3:
                    System.out.print("Recherche : ");
                    String rech = sc.nextLine().toLowerCase();
                    boolean trouve = false;
                    for (int i = 0; i < noms.size(); i++) {
                        if (noms.get(i).toLowerCase().contains(rech)) {
                            System.out.println("→ " + noms.get(i) + " (" + specialites.get(i) + ")");
                            trouve = true;
                        }
                    }
                    if (!trouve) System.out.println("Aucun résultat.");
                    break;
                case 4:
                    System.out.print("Index à modifier (1-" + noms.size() + ") : ");
                    int idx = sc.nextInt() - 1; sc.nextLine();
                    if (idx >= 0 && idx < noms.size()) {
                        System.out.print("Nouveau nom : ");
                        noms.set(idx, sc.nextLine());
                        System.out.print("Nouvelle spécialité : ");
                        specialites.set(idx, sc.nextLine());
                        System.out.println("✓ Modifié !");
                    } else { System.out.println("Index invalide !"); }
                    break;
                case 5:
                    System.out.print("Nom à supprimer : ");
                    String supp = sc.nextLine();
                    int iSupp = noms.indexOf(supp);
                    if (iSupp >= 0) {
                        noms.remove(iSupp);
                        specialites.remove(iSupp);
                        System.out.println("✓ Supprimé !");
                    } else { System.out.println("Non trouvé !"); }
                    break;
                case 6:
                    System.out.println("Total : " + noms.size() + " inventeurs");
                    if (!noms.isEmpty()) {
                        String plusLong = noms.get(0);
                        for (String n : noms) {
                            if (n.length() > plusLong.length()) plusLong = n;
                        }
                        System.out.println("Plus long nom : " + plusLong + " (" + plusLong.length() + " car.)");
                    }
                    break;
                case 0: System.out.println("Au revoir !"); break;
                default: System.out.println("Choix invalide !");
            }
        } while (choix != 0);
        sc.close();
    }
}
