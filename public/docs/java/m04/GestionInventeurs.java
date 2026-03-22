import java.util.ArrayList;
import java.util.Scanner;

/**
 * CODEQUEST - Module 04 : Manipulation de Données
 * Exercice : Gestionnaire d'Inventeurs (CRUD)
 * 
 * OBJECTIF : Pratiquer ArrayList, String methods, while, switch, Scanner
 * Complétez les TODO dans chaque case du switch
 */
public class GestionInventeurs {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ArrayList<String> noms = new ArrayList<>();
        ArrayList<String> specialites = new ArrayList<>();
        int choix;
        
        do {
            System.out.println("\n╔══════════════════════════════╗");
            System.out.println("║  GESTION DES INVENTEURS     ║");
            System.out.println("╠══════════════════════════════╣");
            System.out.println("║  1. Ajouter un inventeur     ║");
            System.out.println("║  2. Afficher tous            ║");
            System.out.println("║  3. Rechercher par nom       ║");
            System.out.println("║  4. Modifier un inventeur    ║");
            System.out.println("║  5. Supprimer un inventeur   ║");
            System.out.println("║  6. Statistiques             ║");
            System.out.println("║  0. Quitter                  ║");
            System.out.println("╚══════════════════════════════╝");
            System.out.print("Choix : ");
            choix = sc.nextInt();
            sc.nextLine(); // Consomme le \n après nextInt()
            
            switch (choix) {
                case 1:
                    // TODO : AJOUTER
                    // 1. Demander le nom (sc.nextLine())
                    // 2. Demander la spécialité
                    // 3. Ajouter aux deux ArrayList avec .add()
                    // 4. Afficher confirmation
                    break;
                    
                case 2:
                    // TODO : AFFICHER TOUS
                    // 1. Vérifier si la liste est vide (.isEmpty())
                    // 2. Si oui → "Aucun inventeur."
                    // 3. Sinon → boucle for pour afficher chaque inventeur
                    //    Format : "1. Nom (Spécialité)"
                    break;
                    
                case 3:
                    // TODO : RECHERCHER
                    // 1. Demander le texte à chercher
                    // 2. Parcourir la liste
                    // 3. Pour chaque nom, vérifier avec :
                    //    noms.get(i).toLowerCase().contains(recherche.toLowerCase())
                    // 4. Afficher les résultats trouvés
                    break;
                    
                case 4:
                    // TODO : MODIFIER
                    // 1. Demander l'index (1-based, l'utilisateur entre 1 pour le premier)
                    // 2. Convertir en 0-based (index - 1)
                    // 3. Vérifier que l'index est valide (>= 0 && < noms.size())
                    // 4. Demander nouveau nom et nouvelle spécialité
                    // 5. Utiliser .set(index, valeur) pour modifier
                    break;
                    
                case 5:
                    // TODO : SUPPRIMER
                    // 1. Demander le nom à supprimer
                    // 2. Trouver l'index avec .indexOf(nom)
                    // 3. Si >= 0 → supprimer avec .remove(index)
                    //    dans les DEUX listes (noms ET spécialités)
                    // 4. Si -1 → "Non trouvé"
                    break;
                    
                case 6:
                    // TODO : STATISTIQUES
                    // 1. Afficher le nombre total (.size())
                    // 2. Trouver le nom le plus long
                    //    (parcourir et comparer .length())
                    // 3. BONUS : compter combien de noms commencent
                    //    par chaque lettre (.charAt(0))
                    break;
                    
                case 0:
                    System.out.println("Au revoir !");
                    break;
                    
                default:
                    System.out.println("Choix invalide !");
            }
        } while (choix != 0);
        
        sc.close();
    }
}

/*
 * CAS DE TEST :
 * 
 * 1. Ajouter "Tesla" (Électricité), "Edison" (Électricité), "Bell" (Télécom)
 * 2. Afficher tous → 3 inventeurs listés
 * 3. Rechercher "el" → Tesla, Bell (contiennent "el")
 * 4. Modifier index 2 → remplacer "Bell" par "Curie" (Physique)
 * 5. Supprimer "Edison" → liste réduite à 2
 * 6. Stats → Total: 2, plus long nom: Tesla
 */
